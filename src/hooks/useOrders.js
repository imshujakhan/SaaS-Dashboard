import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAllOrders,
  selectFilteredOrders,
  selectPaginatedOrders,
  selectTotalPages
} from "../features/orders/ordersSlice";

export const useOrders = () => {
  const dispatch = useDispatch();
  const { loading, searchQuery, currentPage, selectedOrders } = useSelector((state) => state.orders);
  const filteredOrders = useSelector(selectFilteredOrders);
  const paginatedOrders = useSelector(selectPaginatedOrders);
  const totalPages = useSelector(selectTotalPages);

  useEffect(() => {
    const dealerId = localStorage.getItem("dealerId") || "D001";
    dispatch(fetchAllOrders(dealerId));
  }, [dispatch]);

  return {
    loading,
    searchQuery,
    currentPage,
    filteredOrders,
    paginatedOrders,
    totalPages,
    selectedOrders,
  };
};
