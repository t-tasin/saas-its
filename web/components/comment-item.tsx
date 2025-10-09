import { Card, CardContent } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import type { Comment } from "@/types"
import { User } from "lucide-react"

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.author?.name || comment.authorName || "Anonymous"}</span>
              <span className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{comment.body}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
