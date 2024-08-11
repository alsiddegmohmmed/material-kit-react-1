// editProductFormComponent.jsx
'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../server/lib/firebase';

export default function EditProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [productData, setProductData] = React.useState({
    productName: '',
    company: '',
    location: '',
    price: '',
    quantity: '',
    imageUrl: ''
  });

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (productDoc.exists()) {
          setProductData({
            productName: productDoc.data().productName,
            company: productDoc.data().company,
            location: productDoc.data().location,
            price: productDoc.data().price,
            quantity: productDoc.data().quantity,
            imageUrl: productDoc.data().imageUrl,
          });
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (productId) {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, productData);
      router.push('/dashboard/');
    }
  };

  return (
    <div>
      <Typography component="h1" variant="h5">
        Edit Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="productName"
          label="Product Name"
          name="productName"
          value={productData.productName}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="company"
          label="Company"
          name="company"
          value={productData.company}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="location"
          label="Location"
          name="location"
          value={productData.location}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="price"
          label="Price"
          name="price"
          value={productData.price}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="quantity"
          label="Quantity"
          name="quantity"
          value={productData.quantity}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="imageUrl"
          label="Image URL"
          name="imageUrl"
          value={productData.imageUrl}
          onChange={handleInputChange}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
