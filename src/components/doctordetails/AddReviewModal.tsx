import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";

interface AddReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: { name: string; rating: number; time: string; comment: string; avatar: string }) => void;
}

export const AddReviewModal = ({ open, onClose, onSubmit }: AddReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSave = () => {
    onSubmit({
      name: "User",
      rating,
      time: "Just now",
      comment,
      avatar: "/user.jpg",
    });
    setRating(0);
    setComment("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Review</DialogTitle>

      <DialogContent className="space-y-4">
        <Box>
          <label className="block mb-1 font-semibold">Rating</label>
          <Rating value={rating} onChange={(_e, v) => setRating(v || 0)} />
        </Box>

        <TextField
          label="Comment"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSave}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
