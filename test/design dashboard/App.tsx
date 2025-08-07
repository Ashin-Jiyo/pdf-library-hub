import { useState } from "react";
import { StatCard } from "./components/StatCard";
import { PDFTableRow } from "./components/PDFTableRow";
import { CategoriesContent } from "./components/CategoriesContent";
import { UploadContent } from "./components/UploadContent";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Input } from "./components/ui/input";
import {
  FileText,
  Eye,
  Download,
  Calendar,
  Upload,
  Search,
  Home,
  LogOut,
  User,
  Tag,
} from "lucide-react";

// Mock data for PDFs - back to original structure
const mockPDFs = [
  { id: "1", name: "XXX", author: "g", type: "by email" },
  { id: "2", name: "by idk", author: "idk", type: "speech" },
  {
    id: "3",
    name: "1234mb",
    author: "email",
    type: "by email",
  },
  { id: "4", name: "by idk", author: "idk", type: "1234" },
  {
    id: "5",
    name: "testpdfsite",
    author: "idk",
    type: "Other",
  },
  {
    id: "6",
    name: "testpdfsitce2",
    author: "fdfdfd",
    type: "Other",
  },
  {
    id: "7",
    name: "testpdfsiteemail",
    author: "idk",
    type: "Programming",
  },
  {
    id: "8",
    name: "email test",
    author: "email",
    type: "Mobile",
  },
  {
    id: "9",
    name: "1234567890123456678",
    author: "email",
    type: "Mobile",
  },
  {
    id: "10",
    name: "testpdfsite",
    author: "idk",
    type: "Business",
  },
  {
    id: "11",
    name: "by idk",
    author: "idk",
    type: "Programming",
  },
];

export default function App() {
  const [pdfs, setPdfs] = useState(mockPDFs);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleEdit = (id: string) => {
    console.log("Edit PDF:", id);
  };

  const handleDelete = (id: string) => {
    setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
  };

  const handleUpload = () => {
    console.log("Upload new PDF");
  };

  const navItems = [
    { name: "Dashboard", icon: Home, active: true },
    { name: "Categories", icon: Tag, active: false },
    { name: "Upload", icon: Upload, active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                PDF Management
              </h1>
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search PDFs..."
                  className="pl-10 bg-gray-50 border-gray-200 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 rounded-full px-6"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New PDF
              </Button>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white p-6 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    item.name === activeTab
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">
                    {item.name}
                  </span>
                </button>
              );
            })}

            <div className="pt-6 mt-6 border-t border-gray-100 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gray-50">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  {activeTab === "Dashboard" && (
                    <Home className="h-5 w-5 text-white" />
                  )}
                  {activeTab === "Categories" && (
                    <Tag className="h-5 w-5 text-white" />
                  )}
                  {activeTab === "Upload" && (
                    <Upload className="h-5 w-5 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeTab}
                </h2>
              </div>

              {activeTab === "Dashboard" && (
                <>
                  {/* PDF Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                      icon={
                        <FileText className="h-6 w-6 text-white" />
                      }
                      title="Total PDFs"
                      value="14"
                      gradient="bg-gradient-to-r from-blue-400 to-blue-600"
                      iconBg="bg-white/20"
                    />
                    <StatCard
                      icon={
                        <Eye className="h-6 w-6 text-white" />
                      }
                      title="Total Views"
                      value="10"
                      gradient="bg-gradient-to-r from-green-400 to-green-600"
                      iconBg="bg-white/20"
                    />
                    <StatCard
                      icon={
                        <Download className="h-6 w-6 text-white" />
                      }
                      title="Total Downloads"
                      value="1"
                      gradient="bg-gradient-to-r from-purple-400 to-purple-600"
                      iconBg="bg-white/20"
                    />
                    <StatCard
                      icon={
                        <Calendar className="h-6 w-6 text-white" />
                      }
                      title="This Month"
                      value="-"
                      gradient="bg-gradient-to-r from-orange-400 to-red-500"
                      iconBg="bg-white/20"
                    />
                  </div>

                  {/* All PDFs Table */}
                  <Card className="border-0 shadow-lg rounded-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">
                          All PDFs ({pdfs.length})
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100">
                            <TableHead className="text-gray-600 font-semibold">
                              PDF
                            </TableHead>
                            <TableHead className="text-gray-600 font-semibold">
                              ACTIONS
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pdfs.map((pdf) => (
                            <PDFTableRow
                              key={pdf.id}
                              pdf={pdf}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === "Categories" && (
                <CategoriesContent />
              )}

              {activeTab === "Upload" && <UploadContent />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}