import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddProductModal from './components/modal-add';
function Products() {
  const [visibleAdd, setVisibleAdd] = useState(false);
  const onCancel = () => {
    setVisibleAdd(false);
  };
  return (
    <>
      <AddProductModal visible={visibleAdd} onCancel={onCancel} />
      <div className="layout-content">
        <Button
          style={{
            background: '#00994C',
            color: 'white',
            borderRadius: '10px',
          }}
          onClick={() => setVisibleAdd(true)}
          icon={<PlusOutlined />}
        >
          Thêm
        </Button>
      </div>
    </>
  );
}

export default Products;
