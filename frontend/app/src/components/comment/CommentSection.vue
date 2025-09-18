<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold">Comments</h3>
        <span class="text-muted fs-6">({{ comments.length }})</span>
      </div>
      <div class="card-toolbar">
        <button 
          v-if="!showCommentForm" 
          @click="showCommentForm = true"
          class="btn btn-primary"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          Add Comment
        </button>
      </div>
    </div>
    
    <div class="card-body">
      <!-- Comment Form -->
      <div v-if="showCommentForm" class="mb-8">
        <div class="d-flex align-items-start">
          <div class="symbol symbol-35px me-3">
            <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center">
              <KTIcon icon-name="user" icon-class="fs-2 text-primary" />
            </div>
          </div>
          <div class="flex-grow-1">
            <textarea
              v-model="newComment"
              class="form-control form-control-solid"
              rows="3"
              placeholder="Write your comment..."
              @keydown.ctrl.enter="submitComment"
            ></textarea>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div class="form-check">
                <input 
                  v-model="isPrivate" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="privateComment"
                />
                <label class="form-check-label" for="privateComment">
                  Private comment
                </label>
              </div>
              <div>
                <button 
                  @click="cancelComment" 
                  class="btn btn-light me-2"
                >
                  Cancel
                </button>
                <button 
                  @click="submitComment" 
                  :disabled="!newComment.trim() || submitting"
                  class="btn btn-primary"
                >
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="comments.length === 0" class="text-center py-8">
        <KTIcon icon-name="chat" icon-class="fs-2 text-muted" />
        <p class="text-muted mt-3">No comments yet. Be the first to comment!</p>
      </div>

      <div v-else class="comments-list">
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="comment-item mb-6"
        >
          <CommentItem 
            :comment="comment"
            :current-user-id="currentUserId"
            @comment-updated="onCommentUpdated"
            @comment-deleted="onCommentDeleted"
            @reply-added="onReplyAdded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import CommentItem from "./CommentItem.vue";
import { 
  getCommentsByEntity, 
  createComment, 
  type Comment 
} from "@/core/services/businessServices/Comment";
import { useCurrentUser } from "@/core/composables/useCurrentUser";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "comment-section",
  components: {
    KTIcon,
    CommentItem,
  },
  props: {
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
  },
  emits: ['comment-added', 'comment-updated', 'comment-deleted'],
  setup(props, { emit }) {
    const { currentUser } = useCurrentUser();
    const comments = ref<Comment[]>([]);
    const newComment = ref("");
    const isPrivate = ref(false);
    const showCommentForm = ref(false);
    const submitting = ref(false);
    const loading = ref(false);

    const currentUserId = currentUser.value?.id;

    const fetchComments = async () => {
      loading.value = true;
      try {
        const result = await getCommentsByEntity(props.entityType, props.entityId);
        if (result) {
          comments.value = result;
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
      loading.value = false;
    };

    const submitComment = async () => {
      if (!newComment.value.trim() || !currentUserId) return;

      submitting.value = true;
      try {
        const commentData = {
          content: newComment.value.trim(),
          entityType: props.entityType,
          entityId: props.entityId,
          authorId: currentUserId,
          isPrivate: isPrivate.value,
        };

        const newCommentResult = await createComment(commentData);
        if (newCommentResult) {
          comments.value.unshift(newCommentResult);
          emit('comment-added', newCommentResult);
          
          // Reset form
          newComment.value = "";
          isPrivate.value = false;
          showCommentForm.value = false;
          
          Swal.fire('Success', 'Comment posted successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to post comment:', error);
        Swal.fire('Error', 'Failed to post comment.', 'error');
      } finally {
        submitting.value = false;
      }
    };

    const cancelComment = () => {
      newComment.value = "";
      isPrivate.value = false;
      showCommentForm.value = false;
    };

    const onCommentUpdated = (updatedComment: Comment) => {
      const index = comments.value.findIndex(c => c.id === updatedComment.id);
      if (index !== -1) {
        comments.value[index] = updatedComment;
        emit('comment-updated', updatedComment);
      }
    };

    const onCommentDeleted = (commentId: string) => {
      comments.value = comments.value.filter(c => c.id !== commentId);
      emit('comment-deleted', commentId);
    };

    const onReplyAdded = (reply: Comment) => {
      // Find the parent comment and add the reply
      const parentComment = comments.value.find(c => c.id === reply.parentCommentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(reply);
      }
    };

    // Watch for entity changes
    watch(() => [props.entityType, props.entityId], () => {
      if (props.entityType && props.entityId) {
        fetchComments();
      }
    });

    onMounted(() => {
      if (props.entityType && props.entityId) {
        fetchComments();
      }
    });

    return {
      comments,
      newComment,
      isPrivate,
      showCommentForm,
      submitting,
      loading,
      currentUserId,
      submitComment,
      cancelComment,
      onCommentUpdated,
      onCommentDeleted,
      onReplyAdded,
    };
  },
});
</script>

