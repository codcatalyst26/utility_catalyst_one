import { useState } from "react";
import {
  History,
  Search,
  Trash2,
  Edit2,
  Download,
  X,
  Check,
} from "lucide-react";
import { useHistory, type QRHistoryItem } from "@/contexts/HistoryContext";
import { getQRTypeName } from "@/lib/qr-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "@/hooks/use-toast";

interface HistoryPanelProps {
  onSelectItem: (item: QRHistoryItem) => void;
}

export function HistoryPanel({ onSelectItem }: HistoryPanelProps) {
  const {
    history,
    removeFromHistory,
    clearHistory,
    renameItem,
    searchHistory,
  } = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const filteredHistory = searchHistory(searchQuery);

  const startEditing = (item: QRHistoryItem) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      renameItem(id, editName.trim());
      toast({ title: "Renamed", description: "QR code renamed successfully" });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const downloadItem = (item: QRHistoryItem) => {
    const canvas = document.getElementById(
      `history-qr-${item.id}`,
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${item.name.replace(/[^a-z0-9]/gi, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast({ title: "Downloaded!", description: "QR code saved" });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No history yet
        </h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Generated QR codes will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all {history.length} saved QR
                codes. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  clearHistory();
                  toast({
                    title: "Cleared",
                    description: "All history deleted",
                  });
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No results found for "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => onSelectItem(item)}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-lg overflow-hidden bg-white p-1">
                  <QRCodeCanvas
                    id={`history-qr-${item.id}`}
                    value={item.data}
                    size={60}
                    fgColor={item.fgColor}
                    bgColor={item.bgColor}
                    level="L"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {editingId === item.id ? (
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(item.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => saveEdit(item.id)}
                      >
                        <Check className="h-4 w-4 text-success" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <h4 className="font-medium truncate">{item.name}</h4>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getQRTypeName(item.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {item.data.length > 50
                      ? item.data.substring(0, 50) + "..."
                      : item.data}
                  </p>
                </div>

                <div
                  className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => startEditing(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => downloadItem(item)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      removeFromHistory(item.id);
                      toast({
                        title: "Deleted",
                        description: "QR code removed from history",
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
