import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/valueObject/commet-with-author";

export class CommentWithAuthPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId,
      authorId: commentWithAuthor.authorId,
      author: commentWithAuthor.author,
      content: commentWithAuthor.content,
      created_at: commentWithAuthor.createdAt,
      updated_at: commentWithAuthor.updatedAt,
    };
  }
}
