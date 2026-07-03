"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState<string>("all");
  const [wattage, setWattage] = useState<string[]>([]);

  return (
    <Card className="border-border/50 sticky top-20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Lọc sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Khoảng giá</h3>
          <div className="space-y-2">
            {["all", "0-500", "500-1000", "1000+"].map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`price-${range}`}
                  name="price"
                  value={range}
                  checked={priceRange === range}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="accent-primary"
                />
                <Label htmlFor={`price-${range}`} className="font-normal cursor-pointer text-sm">
                  {range === "all" ? "Tất cả" : 
                   range === "0-500" ? "Dưới 500.000đ" : 
                   range === "500-1000" ? "500.000đ - 1.000.000đ" : 
                   "Trên 1.000.000đ"}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3">Công suất</h3>
          <div className="space-y-2">
            {["7W", "9W", "12W", "18W", "24W"].map((w) => (
              <div key={w} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`wattage-${w}`}
                  checked={wattage.includes(w)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWattage([...wattage, w]);
                    } else {
                      setWattage(wattage.filter((item) => item !== w));
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <Label htmlFor={`wattage-${w}`} className="font-normal cursor-pointer text-sm">
                  {w}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
