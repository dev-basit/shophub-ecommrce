import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { listTopSellers } from "../store/user";
import { listProducts } from "../store/products";
import Product from "../components/Product";
import LoadingBox from "../components/common/LoadingBox";
import MessageBox from "../components/common/MessageBox";
import { getQueryParams } from "../utils/functions";

export default function HomeScreen() {
  const { loading, error, products } = useSelector((state) => state.productList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = useSelector((state) => state.userTopSellersList);

  const dispatch = useDispatch();

  useEffect(() => {
    let productFilters = getQueryParams(window.location.search.substring(1));
    dispatch(listTopSellers());
    dispatch(listProducts(productFilters));
  }, [dispatch, window.location.search]);

  return (
    <div>
      <h2>Top Sellers</h2>
      {loadingSellers ? (
        <LoadingBox />
      ) : errorSellers ? (
        <MessageBox variant="danger">{errorSellers}</MessageBox>
      ) : (
        <>
          {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.name} />
                  <p className="legend">{seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2>Featured Products</h2>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product}></Product>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
