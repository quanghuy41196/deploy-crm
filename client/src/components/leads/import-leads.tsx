import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportLeadsProps {
  onClose: () => void;
}

export default function ImportLeads({ onClose }: ImportLeadsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/leads/import', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setUploadResult(data);
      toast({
        title: "Thành công",
        description: `Đã nhập ${data.imported} lead thành công`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi nhập file",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Lỗi",
          description: "Chỉ hỗ trợ file Excel (.xlsx, .xls) và CSV",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a sample CSV template
    const headers = ['Tên', 'Số điện thoại', 'Email', 'Khu vực', 'Sản phẩm', 'Ghi chú'];
    const sampleData = [
      ['Nguyễn Văn A', '0987654321', 'nguyenvana@email.com', 'Hà Nội', 'Sản phẩm A', 'Ghi chú mẫu'],
      ['Trần Thị B', '0912345678', 'tranthib@email.com', 'TP.HCM', 'Sản phẩm B', ''],
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mau_lead_import.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Nhập Lead từ Excel/CSV</DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-6">
        {/* Template Download */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">Tải mẫu file import</h3>
                  <p className="text-sm text-gray-500">
                    Tải file mẫu để đảm bảo định dạng chính xác
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Tải mẫu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Chọn file để nhập</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Hỗ trợ file Excel (.xlsx, .xls) và CSV. Tối đa 1000 lead/file.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                
                {file ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Kích thước: {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Chọn file khác
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleUpload}
                        disabled={uploadMutation.isPending}
                      >
                        {uploadMutation.isPending ? "Đang nhập..." : "Nhập Lead"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Kéo thả file vào đây hoặc click để chọn file
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Chọn file
                    </Button>
                  </div>
                )}

                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Result */}
        {uploadResult && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium">Kết quả nhập file</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Lead nhập thành công:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {uploadResult.imported}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lỗi:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {uploadResult.errors?.length || 0}
                    </span>
                  </div>
                </div>

                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-red-600 mb-2">
                      Chi tiết lỗi:
                    </h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {uploadResult.errors.slice(0, 5).map((error: any, index: number) => (
                        <div key={index} className="text-xs text-red-600 flex items-start space-x-2">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Dòng {error.row}: {error.error}</span>
                        </div>
                      ))}
                      {uploadResult.errors.length > 5 && (
                        <p className="text-xs text-gray-500">
                          ...và {uploadResult.errors.length - 5} lỗi khác
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Hướng dẫn nhập file</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• File phải có các cột: Tên, Số điện thoại, Email, Khu vực, Sản phẩm, Ghi chú</li>
              <li>• Cột "Tên" là bắt buộc, các cột khác có thể để trống</li>
              <li>• Số điện thoại phải đúng định dạng Việt Nam (10-11 số)</li>
              <li>• Email phải đúng định dạng (có chứa @ và tên miền)</li>
              <li>• Tối đa 1000 lead trong một lần nhập</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
