/* eslint-disable array-callback-return */
import {
  Container,
  Divider,
  Checkbox,
  Select,
  MenuItem,
  Box,
  Pagination,
  CircularProgress,
  FormControlLabel,
  Slider,
} from '@mui/material';

import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { useLocation, useParams } from 'react-router-dom';
import _ from 'lodash';
import MDBox from '../../components/MDBox';
import MDTypography from '../../components/MDTypography';
import { Stack } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import userThunk from '../../features/user/user.service';
import optionFilter from './options';
import ProductCard from './product-card.jsx';
function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#101010' : '#fff',
        color: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        p: 1,
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        maxWidth: '250px',
        minWidth: '240px',
        marginRight: '13px',
        marginBottom: '8px',
        ...sx,
      }}
      {...other}
    />
  );
}

const { typePhone, rams, storages, sortOptions } = optionFilter;
const AllProductPage = () => {
  const data = useSelector((state) => state.data);
  const { categories } = data;
  const location = useLocation();
  const dispatch = useDispatch();

  const filterData = useMemo(() => {
    const obj = {};

    const queryParams = new URLSearchParams(location.search);

    const keys = queryParams.keys();
    for (const key of keys) {
      const value = queryParams.get(key);
      obj[key] = value;
    }
    return obj;
  }, [location.search]);
  const categoryCustomList = useMemo(() => {
    let list = [];
    if (filterData.level) {
      const categoryLevel = categories.find(
        (item) => item.slug === filterData.category
      );
      list = categories.filter((item) => item.parentId === categoryLevel._id);
    } else {
      list = categories.filter((item) => item.level === 1);
    }
    return list;
  }, [categories, filterData]);

  const [listProduct, setListProduct] = useState([]);
  const [productPage, setProductPage] = useState([]);
  const [osOption, setOsOption] = useState([]);
  const [sortOption, setSortOption] = useState('Nổi bật');
  const [ramOption, setRamOption] = useState([]);
  const [storageOption, setStorageOption] = useState([]);
  const [categoryOption, setCategoryOption] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [dataLoading, setDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(filterData.page) || 1
  );
  const [totalCount, setTotalCount] = useState(0);
  const handleOptionChange = (option, optionList, setOptionList) => (e) => {
    // url ban đầu
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');

    setDataLoading(true);
    let list = [];
    const index = optionList.indexOf(e.target.value);
    if (index === -1) {
      list = [...optionList, e.target.value];
    } else {
      list = optionList.filter((opt) => opt !== e.target.value);
    }

    setOptionList(list);
    if (option === 'category') {
      if (list.length === 0 && level === '3') {
        const slug = categoryCustomList.map((category) => category.slug);
        const optionSlugs =
          Object.keys(slug).length > 0 ? slug.join('+') : 'all';
        urlParams.set('level', '3');
        urlParams.set(option, optionSlugs);
      } else if (option === 'category' && level === '2') {
        urlParams.set('level', '3');
        const optionSlugs =
          Object.keys(list).length > 0 ? list.join('+') : 'all';
        urlParams.set(option, optionSlugs);
      } else {
        const optionSlugs =
          Object.keys(list).length > 0 ? list.join('+') : 'all';
        urlParams.set(option, optionSlugs);
      }
    } else {
      const optionSlugs = Object.keys(list).length > 0 ? list.join('+') : 'all';
      urlParams.set(option, optionSlugs);
    }

    const obj = {};

    const keys = urlParams.keys();
    for (const key of keys) {
      const value = urlParams.get(key);
      obj[key] = value;
    }

    const newUrl = `${window.location.pathname}?${urlParams}`;
    window.history.replaceState({}, '', newUrl);

    dispatch(userThunk.getProductsOptionAPI(obj))
      .unwrap()
      .then((value) => {
        const { products } = value;
        // Chia mảng sản phẩm thành các phần tử con có độ dài bằng với kích thước trang
        const chunks = _.chunk(products, pageSize);
        // Tính toán các giá trị cần trả về
        const totalProduct = products.length;
        const data = chunks[0] || [];
        const totalPages = chunks.length;
        setProductPage(data);
        setCurrentPage(0);
        setTotalPages(totalPages);
        setPageSize(pageSize);
        setTotalCount(totalProduct);
        setListProduct(chunks);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete('page');
        const newUrl = `${window.location.pathname}?${urlParams}`;
        window.history.replaceState({}, '', newUrl);
        setDataLoading(false);
      });
    //   */
    // setDataLoading(false);
  };
  const handleCategoryChange = handleOptionChange(
    'category',
    categoryOption,
    setCategoryOption
  );
  const handleChangePage = useCallback(
    (event, newPage) => {
      filterData.page = newPage;
      const data = listProduct[newPage - 1] || [];
      setProductPage(data);
      setCurrentPage(newPage);
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('page', newPage);
      const newUrl = `${window.location.pathname}?${urlParams}`;
      window.history.replaceState({}, '', newUrl);
    },
    [listProduct, filterData]
  );

  const handleStorageChange = handleOptionChange(
    'storage',
    storageOption,
    setStorageOption
  );
  const handleRamChange = handleOptionChange('ram', ramOption, setRamOption);
  const handleChangeType = handleOptionChange('type', osOption, setOsOption);

  const getAllProductInit = useCallback(() => {
    setDataLoading(true);
    // dispatch api getall product
    dispatch(userThunk.getProductsOptionAPI(filterData))
      .unwrap()
      .then((value) => {
        const { products } = value;
        // Chia mảng sản phẩm thành các phần tử con có độ dài bằng với kích thước trang
        const chunks = _.chunk(products, pageSize);
        // Tính toán các giá trị cần trả về
        const totalProduct = products.length;
        const data = chunks[0] || [];
        const totalPages = chunks.length;
        setProductPage(data);
        setCurrentPage(0);
        setTotalPages(totalPages);
        setPageSize(pageSize);
        setTotalCount(totalProduct);
        setListProduct(chunks);
        setDataLoading(false);
      });
  }, [dispatch, pageSize, filterData]);

  useEffect(() => {
    getAllProductInit();
  }, [getAllProductInit]);

  return (
    <MDBox
      color="#000000"
      bgColor="Light"
      variant="contained"
      borderRadius="none"
      opacity={1}
      display="flex"
      justifyContent="space-between"
      minHeight="80vh"
    >
      <Container
        sx={{
          backgroundColor: 'Light',
        }}
      >
        <Grid
          item
          sx={{ paddingTop: '10px', marginTop: '10px' }}
          container
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          xs={12}
        >
          <Grid
            item
            xs={2.5}
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ paddingRight: '8px' }}
          >
            <MDBox
              borderRadius="lg"
              width="100%"
              height="100%"
              bgColor="white"
              variant="contained"
              sx={{ padding: '18px 27px', marginBottom: '10px' }}
            >
              {' '}
              <Stack sx={{ marginBottom: '15px', minWidth: '210px' }}>
                <MDTypography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2b3445',
                    marginBottom: '8px',
                  }}
                >
                  Thương hiệu
                </MDTypography>
                {categoryCustomList && categoryCustomList.length !== 0
                  ? categoryCustomList.map((item, index) => {
                      return (
                        <FormControlLabel
                          key={index}
                          label={
                            <MDTypography
                              sx={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#2b3445',
                              }}
                            >
                              {item.name}
                            </MDTypography>
                          }
                          control={
                            <Checkbox
                              value={item.slug}
                              onChange={handleCategoryChange}
                            />
                          }
                        />
                      );
                    })
                  : null}
              </Stack>
              <Divider />
              <Stack direction="column" sx={{ marginBottom: '15px' }}>
                <MDTypography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2b3445',
                    marginBottom: '8px',
                  }}
                >
                  Loại điện thoại
                </MDTypography>
                {typePhone.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      label={
                        <MDTypography
                          sx={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#2b3445',
                          }}
                        >
                          {item.name}
                        </MDTypography>
                      }
                      control={
                        <Checkbox
                          value={item.name}
                          onChange={handleChangeType}
                        />
                      }
                    />
                  );
                })}
              </Stack>
              <Divider />
              <Stack direction="column" sx={{ marginBottom: '15px' }}>
                <MDTypography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2b3445',
                    marginBottom: '8px',
                  }}
                >
                  RAM
                </MDTypography>
                {rams.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      label={
                        <MDTypography
                          sx={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#2b3445',
                          }}
                        >
                          {item.value}
                        </MDTypography>
                      }
                      control={
                        <Checkbox
                          value={item.value}
                          onChange={handleRamChange}
                        />
                      }
                    />
                  );
                })}
              </Stack>
              <Divider />
              <Stack direction="column" sx={{ marginBottom: '15px' }}>
                <MDTypography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2b3445',
                    marginBottom: '8px',
                  }}
                >
                  Dung lượng lưu trữ
                </MDTypography>
                {storages.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      label={
                        <MDTypography
                          sx={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#2b3445',
                          }}
                        >
                          {item.value}
                        </MDTypography>
                      }
                      control={
                        <Checkbox
                          value={item.value}
                          onChange={handleStorageChange}
                        />
                      }
                    />
                  );
                })}
              </Stack>
            </MDBox>
          </Grid>
          <Grid
            item
            xs={9.5}
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ paddingLeft: '8px' }}
          >
            <MDBox
              borderRadius="lg"
              width="100%"
              height="100%"
              bgColor="white"
              variant="contained"
              sx={{ padding: '16px 27px', marginBottom: '10px' }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2b3445',
                  }}
                >
                  {!totalCount ? '0 sản phẩm' : `${totalCount} sản phẩm`}
                </MDTypography>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <MDTypography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2b3445',
                    }}
                  >
                    Sắp xếp theo:
                  </MDTypography>
                  <Select
                    sx={{ width: '150px', height: '35px' }}
                    value={sortOption}
                  >
                    {sortOptions.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={item.name}
                          sx={{ fontWeight: '500' }}
                        >
                          {item.key}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Stack>
              </Stack>
            </MDBox>
            {dataLoading ? (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={2}
              >
                <CircularProgress color="dark" />
              </MDBox>
            ) : Object.keys(productPage).length > 0 ? (
              <MDBox
                variant="contained"
                borderRadius="lg"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                }}
              >
                {productPage.map((item, index) => {
                  if (index < 15) {
                    return (
                      <Item key={index}>
                        <ProductCard category={item._id} groups={item.groups} />
                      </Item>
                    );
                  }
                })}
              </MDBox>
            ) : (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={2}
              >
                <MDTypography sx={{ color: '#111111' }}>
                  Không tìm thấy sản phẩm
                </MDTypography>
              </MDBox>
            )}
            {dataLoading || Object.keys(productPage).length === 0 ? null : (
              <Stack sx={{ marginBottom: '5px' }} justifyContent="center">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handleChangePage}
                />
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </MDBox>
  );
};

export default AllProductPage;
