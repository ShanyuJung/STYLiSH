import { ProductData } from "@/types/types";
import api from "@/utils/api";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

const Products = ({
  firstPageData,
}: {
  firstPageData: { data: ProductData[]; nextPaging: number | null };
}) => {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [paging, setPaging] = useState<number | null>(firstPageData.nextPaging);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const fetchProductsHandler = useCallback(async () => {
    if (isLoading || !router.isReady) return;
    if (!category || !paging) return;
    if (router.query.keyword) return;

    try {
      setIsLoading(true);
      const response = await api.getProducts(category, paging);
      const data = response.data as ProductData[];
      const nextPaging = response.next_paging as number | undefined;
      setProductData((prev) => [...prev, ...data]);
      if (nextPaging === undefined) {
        setPaging(null);
      } else {
        setPaging(nextPaging);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [category, isLoading, paging, router.isReady, router.query.keyword]);

  const searchProductsHandler = useCallback(async () => {
    if (isLoading || !router.isReady) return;
    if (!searchKeyword || !paging) return;
    setCategory("");

    try {
      setIsLoading(true);
      const response = await api.searchProducts(searchKeyword, paging);
      const data = response.data as ProductData[];
      const nextPaging = response.next_paging as number | undefined;
      setProductData((prev) => [...prev, ...data]);
      if (nextPaging === undefined) {
        setPaging(null);
      } else {
        setPaging(nextPaging);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [searchKeyword, isLoading, paging, router.isReady]);

  useEffect(() => {
    const categoryHandler = () => {
      if (!router.isReady) return;
      if (typeof router.query.keyword === "string") {
        setSearchKeyword(router.query.keyword);
        return;
      }

      if (
        typeof router.query.category !== "string" &&
        typeof router.query.category !== "undefined"
      )
        return;
      setProductData([]);
      setCategory(router.query.category || "all");
      setPaging(firstPageData.nextPaging);
    };

    categoryHandler();
  }, [
    firstPageData.nextPaging,
    router.isReady,
    router.query.category,
    router.query.keyword,
  ]);

  useEffect(() => {
    const observerHandler = (entries: { isIntersecting: boolean }[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          searchProductsHandler();
          fetchProductsHandler();
        }
      });
    };
    let observerRefValue: HTMLDivElement | null = null;

    const observer = new IntersectionObserver(observerHandler, options);
    if (containerRef.current) {
      observer.observe(containerRef.current);
      observerRefValue = containerRef.current;
    }

    return () => {
      if (observerRefValue) observer.unobserve(observerRefValue);
    };
  }, [category, fetchProductsHandler, searchProductsHandler]);

  return (
    <div className="flex flex-col items-center mx-auto px-img-container-px-sm pt-img-container-pt-sm pb-img-container-pb-sm relative xl:pt-[70px] xl:px-[60px]">
      <div className="flex flex-wrap w-full gap-x-img-container-gap-sm justify-between xl:gap-[40px] xl:max-w-[1160px] xl:justify-start">
        {firstPageData.data.map((product) => {
          return <ProductCard key={`product-${product.id}`} data={product} />;
        })}
        {firstPageData.data.length === 0 && (
          <div className="w-full text-center text-[20px] xl:text-[30px]">
            找不到相關商品
          </div>
        )}
        {productData.map((product) => {
          return <ProductCard key={`product-${product.id}`} data={product} />;
        })}
      </div>
      <div
        className={
          isLoading
            ? "h-[40px] w-[40px] bg-loading-spinner bg-no-repeat bg-center bg-cover my-[20px]"
            : ""
        }
        ref={containerRef}
      />
    </div>
  );
};

export default Products;
