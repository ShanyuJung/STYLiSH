import { useDispatch } from "react-redux";
import { cartActions } from "@/store/cart-slice";
import { Colors, Variants } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import ColorButton from "./ColorButton";
import SizeButton from "./SizeButton";
import { AppDispatch } from "@/store";

const ProductVariants = ({
  variants,
  colors,
  sizes,
  id,
  title,
  price,
  mainImage,
}: {
  variants: Variants[];
  colors: Colors[];
  sizes: string[];
  id: string;
  title: string;
  price: number;
  mainImage: string;
}) => {
  const [selectedVariants, setSelectedVariants] = useState<{
    selectedColorCode: string;
    selectedColorName: string;
    selectedSize: string;
    quantity: number;
    curStock: number;
  }>({
    selectedColorCode: "",
    selectedColorName: "",
    selectedSize: "",
    quantity: 0,
    curStock: 0,
  });
  const [curStocksOfCurColor, setCurStocksOfCurColor] = useState<Variants[]>(
    []
  );
  const dispatch = useDispatch<AppDispatch>();

  const curStockHandler = useCallback(
    (colorCode: string, size: string) => {
      const target = variants.filter(
        (item) => item.color_code === colorCode && item.size === size
      );
      return target[0]?.stock;
    },
    [variants]
  );

  const quantityHandler = (curQuantity: number, curStock: number) => {
    if (curStock === 0) {
      return 0;
    }
    if (curQuantity >= curStock) {
      return curStock;
    }
    return curQuantity;
  };

  const curStocksOfCurColorHandler = useCallback(
    (colorCode: string) => {
      const newVariants = variants.filter(
        (item) => item.color_code === colorCode
      );

      setCurStocksOfCurColor(newVariants);
    },
    [variants]
  );

  const selectColorHandler = (color: Colors) => {
    const curStock = curStockHandler(color.code, selectedVariants.selectedSize);
    const quantity = quantityHandler(selectedVariants.quantity, curStock);

    const newVariants = {
      selectedColorCode: color.code,
      selectedColorName: color.name,
      selectedSize: selectedVariants.selectedSize,
      quantity: quantity,
      curStock: curStock,
    };

    setSelectedVariants(newVariants);
    curStocksOfCurColorHandler(color.code);
  };

  const selectSizeHandler = (size: string) => {
    const curStock = curStockHandler(selectedVariants.selectedColorCode, size);
    const quantity = quantityHandler(selectedVariants.quantity, curStock);

    const newVariants = {
      selectedColorCode: selectedVariants.selectedColorCode,
      selectedColorName: selectedVariants.selectedColorName,
      selectedSize: size,
      quantity: quantity,
      curStock: curStock,
    };

    setSelectedVariants(newVariants);
  };

  const addQuantityHandler = () => {
    if (selectedVariants.quantity >= selectedVariants.curStock) return;
    const newQuantity = selectedVariants.quantity + 1;

    const newVariants = {
      ...selectedVariants,
      quantity: newQuantity,
    };

    setSelectedVariants(newVariants);
  };

  const reduceQuantityHandler = () => {
    if (selectedVariants.quantity <= 1) return;
    const newQuantity = selectedVariants.quantity - 1;

    const newVariants = {
      ...selectedVariants,
      quantity: newQuantity,
    };

    setSelectedVariants(newVariants);
  };

  const addToCartHandler = () => {
    if (selectedVariants.curStock === 0) {
      window.alert("已無庫存");
      return;
    }

    if (!selectedVariants.selectedColorCode || !selectedVariants.selectedSize) {
      window.alert("請選擇顏色及此寸");
      return;
    }

    const newItem = {
      id: id,
      colorCode: selectedVariants.selectedColorCode,
      colorName: selectedVariants.selectedColorName,
      size: selectedVariants.selectedSize,
      quantity: selectedVariants.quantity,
      curStock: selectedVariants.curStock,
      title: title,
      price: price,
      main_image: mainImage,
    };
    dispatch(cartActions.addItemToCart(newItem));
    window.alert("已加入購物車");
  };

  useEffect(() => {
    if (variants?.length > 0 && colors.length > 0 && sizes.length > 0) {
      const initHandler = () => {
        const curStock = curStockHandler(colors[0].code, sizes[0]);
        const quantity = quantityHandler(1, curStock);

        const newVariants = {
          selectedColorCode: colors[0].code,
          selectedColorName: colors[0].name,
          selectedSize: sizes[0],
          quantity: quantity,
          curStock: curStock,
        };

        setSelectedVariants(newVariants);
        curStocksOfCurColorHandler(colors[0].code);
      };
      initHandler();
    }
  }, [colors, curStockHandler, curStocksOfCurColorHandler, sizes, variants]);

  return (
    <div className="flex flex-col mb-[28px] xl:mb-[40px]">
      <div className="flex justify-start items-center mb-[28px]">
        <div className="text-[14px] leading-[17px] tracking-product-var-sm pr-[8px] border-r border-light-black xl:text-[20px] xl:leading-[24px] xl:tracking-product-title-sm">
          顏色
        </div>
        {colors?.length > 0 &&
          colors?.map((item) => {
            return (
              <ColorButton
                key={`color-${item.code}`}
                color={item}
                selectedColor={selectedVariants.selectedColorCode}
                selectColorHandler={selectColorHandler}
              />
            );
          })}
      </div>
      <div className="flex justify-start items-center mb-[38px] xl:mb-[19px]">
        <div className="text-[14px] leading-[17px] tracking-product-var-sm pr-[8px] border-r border-light-black xl:text-[20px] xl:leading-[24px] xl:tracking-product-title-sm">
          尺寸
        </div>
        {curStocksOfCurColor?.length > 0 &&
          curStocksOfCurColor?.map((item) => {
            return (
              <SizeButton
                key={`size-${item.size}`}
                size={item.size}
                selectedSize={selectedVariants.selectedSize}
                selectSizeHandler={selectSizeHandler}
                isValid={item.stock >= 1}
              />
            );
          })}
      </div>
      <div className="xl:flex xl:justify-start xl:items-center xl:h-[44px] xl:mb-[29px]">
        <div className="hidden text-[14px] leading-[17px] tracking-product-var-sm pr-[8px] border-r border-light-black xl:flex xl:text-[20px] xl:leading-[24px] xl:tracking-product-title-sm">
          數量
        </div>
        <div className="w-full h-[44px] flex justify-between items-center px-[35px] mb-[10px] border border-light-grey-3 xl:w-[160px] xl:ml-[32px] xl:mb-[0px]">
          <button className="text-[16px]" onClick={reduceQuantityHandler}>
            -
          </button>
          <div className="text-[20px] leading-[22px] text-brown">
            {selectedVariants.quantity}
          </div>
          <button className="text-[16px]" onClick={addQuantityHandler}>
            +
          </button>
        </div>
      </div>
      <button
        className="w-full h-[44px] bg-black text-white xl:h-[64px] xl:text-[20px] xl:leading-[30px] xl:tracking-product-title-sm"
        onClick={addToCartHandler}
      >
        加入購物車
      </button>
    </div>
  );
};

export default ProductVariants;
