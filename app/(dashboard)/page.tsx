import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, CircleUserRound, ShoppingBag } from "lucide-react";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data?.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data?.totalOrders);
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();
  return (
    <div className="flex flex-col gap-4 p-10">
      <h1 className="text-heading2-bold">Dashboard</h1>
      <Separator className="bg-grey-1 mb-8 mt-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 md:gap-10 gap-8">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-[18px] font-semibold">
              Total Revenue
            </CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="font-bold">$ {totalRevenue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-[18px] font-semibold">
              Total Orders
            </CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-[18px] font-semibold">
              Total Customers
            </CardTitle>
            <CircleUserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="font-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-[18px] font-semibold">
              Sales Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
