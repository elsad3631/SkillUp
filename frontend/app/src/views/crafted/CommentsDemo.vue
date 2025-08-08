<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h2 class="fw-bold">Comments Demo</h2>
      </div>
    </div>
    
    <div class="card-body">
      <div class="row g-5">
        <!-- Project Comments -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Project Comments</h3>
              <p class="text-muted">Comments for Project ID: demo-project-1</p>
            </div>
            <div class="card-body">
              <CommentSection 
                entity-type="PROJECT"
                entity-id="demo-project-1"
                @comment-added="onCommentAdded"
                @comment-updated="onCommentUpdated"
                @comment-deleted="onCommentDeleted"
              />
            </div>
          </div>
        </div>

        <!-- Task Comments -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Task Comments</h3>
              <p class="text-muted">Comments for Task ID: demo-task-1</p>
            </div>
            <div class="card-body">
              <CommentSection 
                entity-type="TASK"
                entity-id="demo-task-1"
                @comment-added="onCommentAdded"
                @comment-updated="onCommentUpdated"
                @comment-deleted="onCommentDeleted"
              />
            </div>
          </div>
        </div>

        <!-- Experience Comments -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Experience Comments</h3>
              <p class="text-muted">Comments for Experience ID: demo-experience-1</p>
            </div>
            <div class="card-body">
              <CommentSection 
                entity-type="EXPERIENCE"
                entity-id="demo-experience-1"
                @comment-added="onCommentAdded"
                @comment-updated="onCommentUpdated"
                @comment-deleted="onCommentDeleted"
              />
            </div>
          </div>
        </div>

        <!-- Generic Entity Comments -->
        <div class="col-xl-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Generic Entity Comments</h3>
              <p class="text-muted">Comments for Generic Entity ID: demo-entity-1</p>
            </div>
            <div class="card-body">
              <CommentSection 
                entity-type="GENERIC"
                entity-id="demo-entity-1"
                @comment-added="onCommentAdded"
                @comment-updated="onCommentUpdated"
                @comment-deleted="onCommentDeleted"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Features Overview -->
      <div class="row mt-8">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Comment System Features</h3>
            </div>
            <div class="card-body">
              <div class="row g-4">
                <div class="col-md-6">
                  <h4 class="fw-bold mb-3">Core Features</h4>
                  <ul class="list-unstyled">
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Create, read, update, delete comments</span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Reply to comments (nested comments)</span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Private and public comments</span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Real-time updates</span>
                    </li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h4 class="fw-bold mb-3">Entity Support</h4>
                  <ul class="list-unstyled">
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Projects</span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Tasks</span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Experiences</span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <i class="ki-duotone ki-check-circle fs-2 text-success me-2"></i>
                      <span>Any custom entity type</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CommentSection from "@/components/comment/CommentSection.vue";

export default defineComponent({
  name: "comments-demo",
  components: {
    CommentSection,
  },
  setup() {
    const onCommentAdded = (comment: any) => {
      console.log('Comment added:', comment);
    };

    const onCommentUpdated = (comment: any) => {
      console.log('Comment updated:', comment);
    };

    const onCommentDeleted = (commentId: string) => {
      console.log('Comment deleted:', commentId);
    };

    return {
      onCommentAdded,
      onCommentUpdated,
      onCommentDeleted,
    };
  },
});
</script>
