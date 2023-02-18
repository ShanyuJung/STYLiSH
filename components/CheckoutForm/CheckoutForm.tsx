import tappay from "@/utils/tappay";
import { useEffect, useRef, useState } from "react";
import CheckoutAmount from "./CheckoutAmount.";

const FREIGHT = 30;

const CheckoutForm = () => {
  const cardNumberRef = useRef<HTMLDivElement>(null);
  const cardExpirationDateRef = useRef<HTMLDivElement>(null);
  const cardCCVRef = useRef<HTMLDivElement>(null);

  const checkOutHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("checkout");
  };

  useEffect(() => {
    const setupTappay = async () => {
      await tappay.setupSDK();
      tappay.setupCard(
        cardNumberRef.current,
        cardExpirationDateRef.current,
        cardCCVRef.current
      );
    };

    setupTappay();
  }, []);

  return (
    <div className="w-full flex flex-col pb-[35px]">
      <form onSubmit={checkOutHandler}>
        <div className="w-full flex flex-col gap-[20px] mb-[24px]">
          <div className="w-full text-[16px] leading-[19px] font-bold pb-[10px] mb-[20px] border-b border-light-black">
            訂購資料
          </div>
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="recipient"
              className="text-[14px] leading-[17px] text-light-black"
            >
              收件人姓名
            </label>
            <input
              className="w-full border border-light-grey-4 h-[32px] rounded-[8px] px-[5px] overflow-hidden"
              id="recipient"
            />
            <div className="text-[14px] leading-[17px] text-brown">
              務必填寫完整收件人姓名，避免包裹無法順利簽收
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="mobilePhone"
              className="text-[14px] leading-[17px] text-light-black"
            >
              手機
            </label>
            <input
              className="w-full border border-light-grey-4 h-[32px] rounded-[8px] px-[5px] overflow-hidden"
              id="mobilePhone"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="address"
              className="text-[14px] leading-[17px] text-light-black"
            >
              地址
            </label>
            <input
              className="w-full border border-light-grey-4 h-[32px] rounded-[8px] px-[5px] overflow-hidden"
              id="address"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="email"
              className="text-[14px] leading-[17px] text-light-black"
            >
              Email
            </label>
            <input
              className="w-full border border-light-grey-4 h-[32px] rounded-[8px] px-[5px] overflow-hidden"
              id="email"
            />
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <label
              htmlFor="deliverTime"
              className="text-[14px] leading-[17px] text-light-black w-full"
            >
              配送時間
            </label>
            <div className="flex items-center">
              <input
                name="deliverTime"
                id="deliverTime-1"
                value="morning"
                type="radio"
              />
              <label
                htmlFor="deliverTime"
                className="text-[14px] leading-[26px] ml-[5px]"
              >
                08:00-12:00
              </label>
            </div>
            <div className="flex items-center">
              <input
                name="deliverTime"
                id="deliverTime-2"
                value="afternoon"
                type="radio"
              />
              <label
                htmlFor="deliverTime"
                className="text-[14px] leading-[26px] ml-[5px]"
              >
                14:00-18:00
              </label>
            </div>
            <div className="flex items-center">
              <input
                name="deliverTime"
                id="deliverTime-3"
                value="anytime"
                type="radio"
              />
              <label
                htmlFor="deliverTime"
                className="text-[14px] leading-[26px] ml-[5px]"
              >
                不指定
              </label>
            </div>
          </div>
          <div className="w-full text-[16px] leading-[19px] font-bold pb-[10px] mb-[20px] border-b border-light-black">
            付款資料
          </div>
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="card-number"
              className="text-[14px] leading-[17px] text-light-black"
            >
              信用卡號碼
            </label>
            <div
              className="w-full border border-light-grey-4 h-[32px] rounded-[8px] px-[5px] overflow-hidden"
              id="card-number"
              ref={cardNumberRef}
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="card-expiration-date"
              className="text-[14px] leading-[17px] text-light-black"
            >
              有效期限
            </label>
            <div
              className="w-full border border-light-grey-4 h-[32px] rounded-[8px] px-[5px] overflow-hidden"
              id="card-expiration-date"
              ref={cardExpirationDateRef}
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="card-ccv"
              className="text-[14px] leading-[17px] text-light-black"
            >
              安全碼
            </label>
            <div
              className="w-full border border-light-grey-4 h-[32px] rounded-[8px] px-[5px] overflow-hidden"
              id="card-ccv"
              ref={cardCCVRef}
            />
          </div>
        </div>
        <CheckoutAmount freight={FREIGHT} />
        <button className="bg-black text-white w-full h-[44px] text-center text-[16px]leading-[30px]">
          確認付款
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;