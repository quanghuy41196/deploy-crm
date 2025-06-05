import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";
import { X, Plus, Trash2 } from "lucide-react";

const orderSchema = z.object({
  customerId: z.number().min(1, "Vui lòng chọn khách hàng"),
  orderNumber: z.string().min(1, "Mã đơn hàng không được để trống"),
  status: z.string().min(1, "Vui lòng chọn trạng thái"),
  value: z.number().min(0, "Giá trị đơn hàng phải lớn hơn 0"),
  items: z.array(z.object({
    name: z.string().min(1, "Tên sản phẩm không được để trống"),
    quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
    price: z.number().min(0, "Giá phải lớn hơn 0")
  })).min(1, "Phải có ít nhất 1 sản phẩm"),
  notes: z.string().optional()
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  leadId?: number;
  customerId?: number;
}

const CRM_PRODUCTS = [
  { name: "Gói CRM Basic", price: 35000000 },
  { name: "Gói CRM Startup", price: 45000000 },
  { name: "Gói CRM Professional", price: 75000000 },
  { name: "Gói CRM Enterprise", price: 150000000 },
  { name: "Gói CRM Healthcare", price: 90000000 },
  { name: "Gói CRM Banking", price: 175000000 },
  { name: "Gói CRM Retail", price: 80000000 },
  { name: "Gói CRM Manufacturing", price: 120000000 }
];

export default function OrderForm({ open, onClose, leadId, customerId }: OrderFormProps) {
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: customerId || 0,
      orderNumber: `DH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: "pending",
      value: 0,
      items: [{ name: "", quantity: 1, price: 0 }],
      notes: ""
    }
  });

  const { data: customersData } = useQuery({
    queryKey: ["/api/customers"],
    enabled: !customerId
  });

  const customers = customersData?.customers || [];

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được tạo thành công!"
      });
      onClose();
      form.reset();
      setItems([{ name: "", quantity: 1, price: 0 }]);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi tạo đơn hàng",
        variant: "destructive"
      });
    }
  });

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      form.setValue("items", newItems);
      updateTotalValue(newItems);
    }
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    form.setValue("items", newItems);
    updateTotalValue(newItems);
  };

  const updateTotalValue = (currentItems: typeof items) => {
    const total = currentItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    form.setValue("value", total);
  };

  const selectProduct = (index: number, productName: string) => {
    const product = CRM_PRODUCTS.find(p => p.name === productName);
    if (product) {
      updateItem(index, "name", product.name);
      updateItem(index, "price", product.price);
    }
  };

  const onSubmit = (data: OrderFormData) => {
    data.items = items;
    createOrderMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Tạo Đơn Hàng Mới
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Selection */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khách Hàng *</FormLabel>
                    <Select 
                      value={field.value.toString()} 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={!!customerId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khách hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer: any) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name} - {customer.company || "Cá nhân"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Number */}
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã Đơn Hàng *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="DH-2024-001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng Thái *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Chờ Xử Lý</SelectItem>
                        <SelectItem value="processing">Đang Xử Lý</SelectItem>
                        <SelectItem value="shipped">Đã Giao Hàng</SelectItem>
                        <SelectItem value="completed">Hoàn Thành</SelectItem>
                        <SelectItem value="cancelled">Đã Hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Value (Read-only) */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng Giá Trị</FormLabel>
                    <FormControl>
                      <Input 
                        value={formatCurrency(field.value)} 
                        readOnly 
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Sản Phẩm *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Sản phẩm #{index + 1}</h4>
                    {items.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Product Name */}
                    <div className="space-y-2">
                      <Label>Tên Sản Phẩm</Label>
                      <Select 
                        value={item.name} 
                        onValueChange={(value) => selectProduct(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sản phẩm CRM" />
                        </SelectTrigger>
                        <SelectContent>
                          {CRM_PRODUCTS.map((product) => (
                            <SelectItem key={product.name} value={product.name}>
                              {product.name} - {formatCurrency(product.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label>Số Lượng</Label>
                      <Input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label>Đơn Giá</Label>
                      <Input 
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      Thành tiền: <strong>{formatCurrency(item.quantity * item.price)}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi Chú</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Ghi chú thêm về đơn hàng..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={createOrderMutation.isPending}
                className="min-w-[100px]"
              >
                {createOrderMutation.isPending ? "Đang tạo..." : "Tạo Đơn Hàng"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}