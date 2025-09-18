<template>
  <div class="comment-item">
    <div class="d-flex align-items-start">
      <!-- Author Avatar -->
      <div class="symbol symbol-35px me-3">
        <div class="symbol-label bg-light-success d-flex align-items-center justify-content-center">
          <span class="fw-bold fs-7 text-white">
            {{ getInitials(comment.author?.firstName, comment.author?.lastName) }}
          </span>
        </div>
      </div>

      <!-- Comment Content -->
      <div class="flex-grow-1">
        <div class="d-flex align-items-center mb-2">
          <span class="fw-bold fs-6 me-2">
            {{ comment.author?.firstName }} {{ comment.author?.lastName }}
          </span>
          <span class="text-muted fs-7">
            {{ formatDate(comment.createdAt) }}
          </span>
          <span v-if="comment.isPrivate" class="badge badge-light-warning ms-2">
            Private
          </span>
        </div>

        <!-- Comment Text -->
        <div v-if="!isEditing" class="comment-content mb-3">
          <p class="text-gray-800 mb-0">{{ comment.content }}</p>
        </div>

        <!-- Edit Form -->
        <div v-else class="edit-form mb-3">
          <textarea
            v-model="editContent"
            class="form-control form-control-solid"
            rows="3"
            @keydown.ctrl.enter="saveEdit"
          ></textarea>
          <div class="d-flex justify-content-end mt-2">
            <button @click="cancelEdit" class="btn btn-light btn-sm me-2">
              Cancel
            </button>
            <button @click="saveEdit" :disabled="!editContent.trim() || saving" class="btn btn-primary btn-sm">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              Save
            </button>
          </div>
        </div>

        <!-- Comment Actions -->
        <div class="d-flex align-items-center">
          <button 
            @click="toggleReplyForm" 
            class="btn btn-sm btn-light-primary me-2"
          >
            <KTIcon icon-name="reply" icon-class="fs-7" />
            Reply
          </button>
          
          <button 
            v-if="canEdit" 
            @click="startEdit" 
            class="btn btn-sm btn-light-warning me-2"
          >
            <KTIcon icon-name="pencil" icon-class="fs-7" />
            Edit
          </button>
          
          <button 
            v-if="canDelete" 
            @click="deleteComment" 
            class="btn btn-sm btn-light-danger"
          >
            <KTIcon icon-name="trash" icon-class="fs-7" />
            Delete
          </button>
        </div>

        <!-- Reply Form -->
        <div v-if="showReplyForm" class="reply-form mt-4">
          <div class="d-flex align-items-start">
            <div class="symbol symbol-30px me-3">
              <div class="symbol-label bg-light-primary d-flex align-items-center justify-content-center">
                <KTIcon icon-name="user" icon-class="fs-7 text-primary" />
              </div>
            </div>
            <div class="flex-grow-1">
              <textarea
                v-model="replyContent"
                class="form-control form-control-solid"
                rows="2"
                placeholder="Write a reply..."
                @keydown.ctrl.enter="submitReply"
              ></textarea>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="form-check">
                  <input 
                    v-model="replyIsPrivate" 
                    class="form-check-input" 
                    type="checkbox" 
                    id="privateReply"
                  />
                  <label class="form-check-label fs-7" for="privateReply">
                    Private reply
                  </label>
                </div>
                <div>
                  <button @click="cancelReply" class="btn btn-light btn-sm me-2">
                    Cancel
                  </button>
                  <button 
                    @click="submitReply" 
                    :disabled="!replyContent.trim() || submittingReply"
                    class="btn btn-primary btn-sm"
                  >
                    <span v-if="submittingReply" class="spinner-border spinner-border-sm me-1"></span>
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Replies -->
        <div v-if="comment.replies && comment.replies.length > 0" class="replies mt-4">
          <div 
            v-for="reply in comment.replies" 
            :key="reply.id"
            class="reply-item ms-4 border-start border-2 border-light ps-4 mb-3"
          >
            <CommentItem 
              :comment="reply"
              :current-user-id="currentUserId"
              @comment-updated="onReplyUpdated"
              @comment-deleted="onReplyDeleted"
              @reply-added="onReplyAdded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { 
  updateComment, 
  deleteComment as deleteCommentService, 
  createComment,
  type Comment 
} from "@/core/services/businessServices/Comment";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "comment-item",
  components: {
    KTIcon,
  },
  props: {
    comment: {
      type: Object as () => Comment,
      required: true,
    },
    currentUserId: {
      type: String,
      required: true,
    },
  },
  emits: ['comment-updated', 'comment-deleted', 'reply-added'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const editContent = ref("");
    const saving = ref(false);
    const showReplyForm = ref(false);
    const replyContent = ref("");
    const replyIsPrivate = ref(false);
    const submittingReply = ref(false);

    const canEdit = computed(() => {
      return props.comment.authorId === props.currentUserId;
    });

    const canDelete = computed(() => {
      return props.comment.authorId === props.currentUserId;
    });

    const startEdit = () => {
      editContent.value = props.comment.content;
      isEditing.value = true;
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editContent.value = "";
    };

    const saveEdit = async () => {
      if (!editContent.value.trim()) return;

      saving.value = true;
      try {
        const updatedComment = await updateComment(props.comment.id, {
          content: editContent.value.trim(),
          isPrivate: props.comment.isPrivate,
        });

        if (updatedComment) {
          emit('comment-updated', updatedComment);
          isEditing.value = false;
          Swal.fire('Success', 'Comment updated successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to update comment:', error);
        Swal.fire('Error', 'Failed to update comment.', 'error');
      } finally {
        saving.value = false;
      }
    };

    const deleteComment = async () => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        try {
          const success = await deleteCommentService(props.comment.id);
          if (success) {
            emit('comment-deleted', props.comment.id);
            Swal.fire('Deleted!', 'Comment has been deleted.', 'success');
          }
        } catch (error) {
          console.error('Failed to delete comment:', error);
          Swal.fire('Error', 'Failed to delete comment.', 'error');
        }
      }
    };

    const toggleReplyForm = () => {
      showReplyForm.value = !showReplyForm.value;
      if (!showReplyForm.value) {
        replyContent.value = "";
        replyIsPrivate.value = false;
      }
    };

    const cancelReply = () => {
      showReplyForm.value = false;
      replyContent.value = "";
      replyIsPrivate.value = false;
    };

    const submitReply = async () => {
      if (!replyContent.value.trim()) return;

      submittingReply.value = true;
      try {
        const replyData = {
          content: replyContent.value.trim(),
          entityType: props.comment.entityType,
          entityId: props.comment.entityId,
          authorId: props.currentUserId,
          parentCommentId: props.comment.id,
          isPrivate: replyIsPrivate.value,
        };

        const newReply = await createComment(replyData);
        if (newReply) {
          emit('reply-added', newReply);
          showReplyForm.value = false;
          replyContent.value = "";
          replyIsPrivate.value = false;
          Swal.fire('Success', 'Reply posted successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to post reply:', error);
        Swal.fire('Error', 'Failed to post reply.', 'error');
      } finally {
        submittingReply.value = false;
      }
    };

    const onReplyUpdated = (updatedReply: Comment) => {
      if (props.comment.replies) {
        const index = props.comment.replies.findIndex(r => r.id === updatedReply.id);
        if (index !== -1) {
          props.comment.replies[index] = updatedReply;
        }
      }
    };

    const onReplyDeleted = (replyId: string) => {
      if (props.comment.replies) {
        props.comment.replies = props.comment.replies.filter(r => r.id !== replyId);
      }
    };

    const onReplyAdded = (reply: Comment) => {
      if (!props.comment.replies) {
        props.comment.replies = [];
      }
      props.comment.replies.push(reply);
    };

    const formatDate = (date: Date | string) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
      } catch (error) {
        return 'Invalid Date';
      }
    };

    const getInitials = (firstName: string = '', lastName: string = ''): string => {
      const first = firstName ? firstName.charAt(0).toUpperCase() : '';
      const last = lastName ? lastName.charAt(0).toUpperCase() : '';
      return first + last;
    };

    return {
      isEditing,
      editContent,
      saving,
      showReplyForm,
      replyContent,
      replyIsPrivate,
      submittingReply,
      canEdit,
      canDelete,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteComment,
      toggleReplyForm,
      cancelReply,
      submitReply,
      onReplyUpdated,
      onReplyDeleted,
      onReplyAdded,
      formatDate,
      getInitials,
    };
  },
});
</script>

