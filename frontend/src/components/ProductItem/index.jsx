/* eslint-disable array-callback-return */
import React, { useEffect, useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CircularProgress from '@mui/material/CircularProgress';
// Material Dashboard 2 React components
import MDBox from '../MDBox';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import MDTypography from '../MDTypography';
import MDButton from '../MDButton';
import { Button, Chip, Stack } from '@mui/material';
import { formatThousand } from '../../utils/custom-price';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSelector } from 'react-redux';
import { renderScreen } from '../../utils/custom-products';

function ProductCard({
  index,
  rams,
  storages,
  options,
  productSelected,
  productGroup,
  groupColors,
  categorySlug,
}) {
  const [optionSelected, setOptionSelected] = useState(0);
  const [product, setProduct] = useState(productSelected);

  const {
    name,
    productPictures,
    regularPrice,
    salePrice,
    sale,
    detailsProduct,
  } = product;

  const [ramSelected, setRamSelected] = useState(detailsProduct.ram);
  const [storageSelected, setStorageSelected] = useState(
    detailsProduct.storage
  );
  const screenCustom = renderScreen(detailsProduct.screen);
  const customOptions = useMemo(() => {
    let custom = [];
    if (
      rams.length > 1 &&
      storages.length > 1 &&
      rams.length <= 2 &&
      storages.length <= 2
    ) {
      custom = options;
    } else if (rams.length === 1 || storages.length === 1) {
      custom = storages;
    } else {
      custom = Object.keys(groupColors);
    }
    return custom;
  }, [groupColors, storages, rams, options]);

  useEffect(() => {
    if (customOptions.length === storages.length) {
      rams.map((item, index) => {
        if (optionSelected === index) {
          setRamSelected(item);
        }
      });
      setStorageSelected(storages[optionSelected]);
    } else {
      customOptions.map((item, index) => {
        if (index === optionSelected) {
          setRamSelected(item.split('-')[0]);
          setStorageSelected(item.split('-')[1]);
        }
      });
    }
  }, [customOptions, optionSelected, rams, storages.length, storages]);
  // get Product from id
  useEffect(() => {
    productGroup.map((item) => {
      const {
        detailsProduct: { ram, storage },
      } = item;
      if (ram === ramSelected && storage === storageSelected) {
        setProduct(item);
        return;
      }
    });
  }, [storageSelected, ramSelected, productGroup]);
  return (
    <Card
      key={index}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'visible',
      }}
    >
      <>
        <Link
          to={`/product-page/${categorySlug}?ram=${ramSelected}&storage=${storageSelected}`}
          state={{
            product: product,
            option: customOptions,
            rams: rams,
            storages: storages,
            groupColors: groupColors,
          }}
        >
          <MDBox
            position="relative"
            width="100%"
            sx={{
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardMedia
              src={productPictures[0]}
              component="img"
              title={name}
              sx={{
                maxWidth: '100%',
                height: '200px',
                margin: 0,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </MDBox>
        </Link>

        <MDBox mb={0.5} mx={0.5}>
          <MDBox mb={0.5}>
            <Link
              to={`/product-page/${categorySlug}?ram=${ramSelected}&storage=${storageSelected}`}
              state={{
                product: product,
                option: customOptions,
                optionSelected: optionSelected,
                rams: rams,
                storages: storages,
                productGroup: productGroup,
                groupColors: groupColors,
              }}
            >
              <MDTypography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  height: '50px',
                }}
                textTransform="capitalize"
                color="dark"
              >
                {name}
              </MDTypography>
            </Link>
          </MDBox>
          <MDBox
            mb={0.5}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid
              container
              justifyContent="flex-start"
              alignItems="flex-start"
              xs={12}
            >
              {/* thông tin màn hình */}
              {screenCustom.map((item, index) => {
                return (
                  <Chip
                    key={index}
                    size="medium"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: '500',
                      borderRadius: '0.3rem',
                      marginRight: '3px',
                      marginBottom: '3px',
                    }}
                    label={item}
                  />
                );
              })}
            </Grid>
          </MDBox>
          <MDBox
            mb={1}
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid
              container
              justifyContent="flex-start"
              alignItems="flex-start"
              xs={12}
            >
              {customOptions.map((item, index) => {
                return (
                  <Button
                    key={index}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      padding: '2px 3px',
                      border: optionSelected === index ? '1px solid #111' : '',
                      borderRadius: '0.3rem',
                      marginRight: '3px',
                      marginBottom: '3px',
                      width: '30px',
                      color: '#111',
                      backgroundColor: '#d0e0e3',
                    }}
                    onClick={() => setOptionSelected(index)}
                  >
                    {item}
                  </Button>
                );
              })}
            </Grid>
            {/* // danh sách ram */}
          </MDBox>
          <MDBox display="flex" justifyContent="flex-start" alignItems="center">
            <MDTypography
              sx={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#696969',
                textDecoration: 'line-through',
              }}
              textTransform="capitalize"
            >
              {formatThousand(regularPrice)}đ
            </MDTypography>
            <span
              style={{
                marginLeft: '3px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#B00E18',
              }}
            >
              {sale !== '0' ? `-${sale}%` : null}
            </span>
          </MDBox>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
              textTransform="capitalize"
              color="dark"
            >
              {formatThousand(salePrice)}đ
            </MDTypography>
            <MDBox display="flex">
              <FavoriteIcon fontSize="medium" color="primary" />
            </MDBox>
          </MDBox>
        </MDBox>
      </>
    </Card>
  );
}

export default ProductCard;
