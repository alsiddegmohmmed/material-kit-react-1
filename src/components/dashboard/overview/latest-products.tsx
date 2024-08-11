'use client';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../server/lib/firebase';
import { Link, TablePagination, CircularProgress, SxProps } from '@mui/material';
import { paths } from '@/paths';

export interface Product {
  id: string;
  imageUrl: string;
  productName: string;
  company: string;
  location: string;
  price: string;
  quantity: number;
  updatedAt: Date;
}

export interface LatestProductsProps {
  sx?: SxProps;
  searchTerm: string;
  limit?: number;
  paginate?: boolean;
}

export function LatestProducts({ sx, searchTerm, limit, paginate = false }: LatestProductsProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          quantity: data.quantity || 1,
          updatedAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      }) as Product[];
      setProducts(productsData);
      setTotalProducts(productsData.length);
      setLoading(false);
    };

    void fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOpen = (product: Product): void => {
    setSelectedProduct(product);
    setQuantity(product.quantity);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (amount: number): void => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const deleteProductById = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter((product) => product.id !== id));
  };

  const updateProductQuantity = async (productId: string, newQuantity: number): Promise<void> => {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { quantity: newQuantity });
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const handlePageChange = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const applyPagination = (rows: Product[], page: number, rowsPerPage: number): Product[] => {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const paginatedProducts = applyPagination(filteredProducts, page, rowsPerPage);

  return (
    <Card sx={sx}>
      <CardHeader
        title="Latest products"
        action={
          <Typography variant="subtitle1" color="text.secondary">
            {searchTerm ? `${filteredProducts.length} items found` : `${totalProducts} items`}
          </Typography>
        }
      />
      <Divider />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List>
            {paginatedProducts.length === 0 ? (
              <ListItem>
                <ListItemText primary="No items found" />
              </ListItem>
            ) : (
              paginatedProducts.map((product, index) => (
                <ListItem
                  divider={index < paginatedProducts.length - 1}
                  key={product.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <ListItemAvatar>
                    {product.imageUrl ? (
                      <Box
                        component="img"
                        src={product.imageUrl}
                        sx={{ borderRadius: 1, height: '48px', width: '48px' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          borderRadius: 1,
                          backgroundColor: 'var(--mui-palette-neutral-500)',
                          height: '48px',
                          width: '48px',
                        }}
                      />
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={product.productName}
                    primaryTypographyProps={{ variant: 'subtitle1' }}
                    secondary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box flexDirection="column">
                          <Box mr={2} display="flex" gap="20px" alignItems="center">
                            <Typography component="span" variant="body2" color="text.primary">
                              Company: {product.company}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              Quantity: {product.quantity}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {product.location}
                            </Typography>
                          </Box>
                          <Box mr={2} display="flex" gap="20px" alignItems="center">
                            <Typography component="span" variant="body2" color="text.secondary">
                              ${product.price}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              Updated {dayjs(product.updatedAt).format('MMM D, YYYY')}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                  <Button variant="outlined" onClick={() => { handleClickOpen(product); }}>
                    Update stock
                  </Button>
                  <Link href={`/dashboard/products/edit?id=${product.id}`}>
                    <IconButton edge="end">
                      <DotsThreeVerticalIcon weight="bold" />
                    </IconButton>
                  </Link>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteProduct(product);
                      setDeleteOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))
            )}
          </List>
          {!paginate && (
            <>


          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
              size="small"
              variant="text"
              component={RouterLink}
              href={paths.dashboard.products}
            >
              View all
            </Button>
          </CardActions>
          </>
        )}
        <Divider />
          {paginate && (
            <TablePagination
              component="div"
              count={filteredProducts.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </>
      )}
      {selectedProduct ? (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                if (selectedProduct) {
                  updateProductQuantity(selectedProduct.id, quantity);
                }
                handleClose();
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      {deleteProduct ? (
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this product: {deleteProduct.productName}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (deleteProduct) {
                  deleteProductById(deleteProduct.id);
                }
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </Card>
  );
}

LatestProducts.propTypes = {
  sx: PropTypes.object,
  searchTerm: PropTypes.string.isRequired,
  limit: PropTypes.number,
  paginate: PropTypes.bool,
};

