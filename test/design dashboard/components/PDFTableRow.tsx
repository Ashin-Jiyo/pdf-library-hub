import { TableCell, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Edit, Trash2, FileText } from "lucide-react";

interface PDFTableRowProps {
  pdf: {
    id: string;
    name: string;
    author: string;
    type: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'programming':
      return 'bg-blue-500';
    case 'business':
      return 'bg-green-500';
    case 'mobile':
      return 'bg-purple-500';
    case 'by email':
      return 'bg-orange-500';
    case 'speech':
      return 'bg-red-500';
    case 'other':
      return 'bg-gray-500';
    default:
      return 'bg-indigo-500';
  }
};

export function PDFTableRow({ pdf, onEdit, onDelete }: PDFTableRowProps) {
  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-12 rounded-full ${getTypeColor(pdf.type)}`}></div>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{pdf.type}</span>
            <span className="text-sm text-gray-600">by {pdf.author}</span>
            <span className="text-xs text-gray-500">{pdf.name}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(pdf.id)}
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(pdf.id)}
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}