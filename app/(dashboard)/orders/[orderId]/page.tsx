import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(
    `${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`,
    {
      method: "GET",
    }
  );
  const { orderDetails, customer } = await res.json();

  const { street, city, state, postalCode, country } =
    orderDetails.shippingAddress;

  return (
    <div className="flex flex-col p-10">
      <div className="flex flex-col gap-4">
        <p className="font-bold text-[20px]">
          Order ID:{" "}
          <span className="font-normal text-[18px]">{orderDetails._id}</span>
        </p>
        <p className="font-bold text-[20px]">
          Customer name:{" "}
          <span className="font-normal text-[18px]">{customer.name}</span>
        </p>
        <p className="font-bold text-[20px]">
          Shipping address:{" "}
          <span className="font-normal text-[18px]">
            {street}, {city}, {state}, {postalCode}, {country}
          </span>
        </p>
        <p className="font-bold text-[20px]">
          Total paid:{" "}
          <span className="font-normal text-[18px]">
            {orderDetails.totalAmount}
          </span>
        </p>
        <p className="font-bold text-[20px]">
          Shipping rate Id:{" "}
          <span className="font-normal text-[18px]">
            {orderDetails.shippingRate}
          </span>
        </p>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={orderDetails.products}
          searchKey="product"
        />
      </div>
    </div>
  );
};

export default OrderDetails;

export const dynamic = "force-dynamic";
