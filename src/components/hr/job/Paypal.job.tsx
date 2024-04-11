import React, { useEffect } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
    FUNDING
} from "@paypal/react-paypal-js";

interface ButtonWrapperProps {
    currency: string;
    showSpinner: boolean;
    amount: number;
}

const style: any = { layout: "vertical" };

function createOrder({ currency, amount }: { currency: string; amount: number }) {
    // Thay đổi logic này bằng logic tạo đơn hàng thực tế của bạn
    const order = {
        purchase_units: [{ amount: { currency_code: currency, value: amount } }]
    };

    // Trả về một Promise giải quyết với ID đơn hàng
    return new Promise<string>((resolve, reject) => {
        // Giả lập một hoạt động bất đồng bộ (thay thế bằng cuộc gọi server thực tế của bạn)
        setTimeout(() => {
            const orderId = 'abc123'; // ID đơn hàng mẫu
            resolve(orderId);
        }, 1000); // Giả lập 1 giây chờ
    });
}

function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async (response: any) => {
        console.log("check reS: ", response);
        // if (response.status === 'COMPLETED') {
        //     // Xử lý sau khi đơn hàng được chụp thành công
        // }
    });
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ currency, showSpinner, amount }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency: currency,
            }
        });
    }, [currency, showSpinner]);

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={FUNDING.PAYPAL}
                createOrder={(data, actions) => createOrder({ currency, amount })}
                onApprove={onApprove}
            />
        </>
    );
};

const Paypal: React.FC<{ amount: number }> = ({ amount }) => {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
};
