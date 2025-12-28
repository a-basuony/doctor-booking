import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

interface AddReviewModalProps {
  open: boolean;
  onClose: () => void;
  bookingId?: string | number;
  doctorId?: string;
  doctorName?: string;
  onSubmit?: (review: any) => void;
}

export const AddReviewModal = ({
  open,
  onClose,
  onSubmit,
  bookingId,
  // doctorId,
  doctorName = "the doctor",
}: AddReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSave = async () => {
    if (!comment.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (bookingId) {
      setIsSubmitting(true);
      try {
        const reviewData = {
          booking_id:
            typeof bookingId === "string" ? parseInt(bookingId) : bookingId,
          rating: rating,
          comment: comment,
        };

        console.log("Submitting review:", reviewData);

        const response = await api.post<{
          success: boolean;
          message: string;
          data?: Record<string, unknown>;
        }>("/reviews", reviewData);

        if (response.data.success) {
          toast.success("Review submitted successfully!");
          localStorage.setItem(`review_submitted_${bookingId}`, "true");

          if (onSubmit) {
            onSubmit({
              name: "You",
              rating,
              time: "Just now",
              comment,
              avatar: "/user.jpg",
            });
          }

          setRating(0);
          setComment("");
          onClose();
        } else {
          toast.error(response.data.message || "Failed to submit review");
        }
      } catch (err: any) {
        console.error("Error submitting review:", err);

        let errorMessage = "Unable to submit review. Please try again.";

        if (err.response) {
          if (err.response.status === 403) {
            errorMessage =
              err.response.data?.message ||
              "You can only submit a review after your appointment session is completed. Please wait until your session is finished.";
          } else if (err.response.status === 400) {
            errorMessage = "Invalid review data. Please check your input.";
          } else if (err.response.status === 404) {
            errorMessage = "Booking not found. Please verify your booking ID.";
          } else if (err.response.status === 409) {
            errorMessage =
              "You have already submitted a review for this booking.";
            localStorage.setItem(`review_submitted_${bookingId}`, "true");
          } else if (err.response.status === 422) {
            errorMessage = "Validation error. Please check your review.";
          } else {
            errorMessage = err.response.data?.message || errorMessage;
          }
        }

        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else if (onSubmit) {
      onSubmit({
        name: "User",
        rating,
        time: "Just now",
        comment,
        avatar: "/user.jpg",
      });
      setRating(0);
      setComment("");
      onClose();
    } else {
      toast.error("Booking ID is required to submit a review");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          margin: isMobile ? 0 : "32px",
          borderRadius: isMobile ? 0 : "8px",
          maxHeight: isMobile ? "100vh" : "calc(100vh - 64px)",
          overflowY: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: isMobile ? "1.25rem" : "1.5rem",
          fontWeight: 600,
          padding: isMobile ? "20px 20px 16px" : "24px 24px 20px",
          borderBottom: isMobile ? "1px solid #e5e7eb" : "none",
        }}
      >
        {bookingId ? `Review ${doctorName}` : "Add Review"}
      </DialogTitle>

      <DialogContent
        sx={{
          padding: isMobile ? "20px" : "24px",
          "&.MuiDialogContent-root": {
            paddingTop: isMobile ? "20px" : "24px",
          },
        }}
      >
        <Box sx={{ marginBottom: 3 }}>
          <label
            className="block mb-1 font-semibold"
            style={{ fontSize: isMobile ? "0.95rem" : "1rem" }}
          >
            Rating
          </label>
          <Rating
            value={rating}
            onChange={(_e, v) => setRating(v || 0)}
            disabled={isSubmitting}
            size={isMobile ? "large" : "medium"}
            sx={{
              fontSize: isMobile ? "2.5rem" : "2rem",
              "& .MuiRating-icon": {
                marginRight: isMobile ? "4px" : "2px",
                marginLeft: isMobile ? "4px" : "2px",
              },
            }}
          />
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <TextField
            label="Your review"
            fullWidth
            multiline
            rows={isMobile ? 3 : 4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was your experience like with the doctor? Share details that would help other patients."
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: isMobile ? "0.95rem" : "1rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: isMobile ? "0.95rem" : "1rem",
              },
            }}
          />
          <Box
            sx={{
              marginTop: "4px",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              color: "#6b7280",
            }}
          >
            Your review will be visible to other patients
          </Box>
        </Box>

        {bookingId && (
          <Box
            sx={{
              marginTop: 2,
              padding: 2,
              backgroundColor: "#eff6ff",
              borderRadius: "6px",
              border: "1px solid #dbeafe",
              marginBottom: 2,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? "0.875rem" : "0.95rem",
                color: "#1e40af",
                lineHeight: 1.5,
              }}
            >
              Reviewing appointment #{bookingId}
              {doctorName && ` with ${doctorName}`}
            </p>
          </Box>
        )}

        {!bookingId && (
          <Box
            sx={{
              marginTop: 2,
              padding: 2,
              backgroundColor: "#fffbeb",
              borderRadius: "6px",
              border: "1px solid #fde68a",
              marginBottom: 2,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? "0.875rem" : "0.95rem",
                color: "#92400e",
                lineHeight: 1.5,
              }}
            >
              Note: You need to book an appointment first to submit a review.
            </p>
          </Box>
        )}

        {bookingId && (
          <Box
            sx={{
              marginTop: 2,
              padding: 2,
              backgroundColor: "#f0f9ff",
              borderRadius: "6px",
              border: "1px solid #bae6fd",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? "0.875rem" : "0.95rem",
                color: "#0369a1",
                lineHeight: 1.5,
              }}
            >
              <strong>Note:</strong> You can only submit a review after your
              appointment session is completed.
            </p>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          padding: isMobile ? "16px 20px 20px" : "20px 24px 24px",
          borderTop: isMobile ? "1px solid #e5e7eb" : "none",
          flexDirection: isMobile ? "column-reverse" : "row",
          gap: isMobile ? "12px" : "8px",
        }}
      >
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            margin: 0,
            padding: isMobile ? "12px" : "8px 16px",
            borderRadius: "8px",
            fontSize: isMobile ? "1rem" : "0.875rem",
            fontWeight: isMobile ? 500 : 400,
            minHeight: isMobile ? "48px" : "auto",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={isMobile ? 24 : 20} color="inherit" />
            ) : null
          }
          fullWidth={isMobile}
          sx={{
            margin: 0,
            padding: isMobile ? "12px" : "8px 16px",
            borderRadius: "8px",
            fontSize: isMobile ? "1rem" : "0.875rem",
            fontWeight: 600,
            minHeight: isMobile ? "48px" : "auto",
            backgroundColor: "#155ab6",
            "&:hover": {
              backgroundColor: "#0e4a9c",
            },
            "&.Mui-disabled": {
              backgroundColor: "#9ca3af",
            },
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
