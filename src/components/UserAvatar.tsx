import { Avatar } from "@mui/material";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: number;
  className?: string;
  onClick?: () => void;
  sx?: object;
}

const UserAvatar = ({
  name,
  image,
  size = 40,
  className = "",
  onClick,
  sx = {},
}: UserAvatarProps) => {
  // Get first two characters of name
  const getInitials = (name: string): string => {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  // If image exists, show image
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`rounded-full object-cover cursor-pointer ${className}`}
        style={{ width: size, height: size }}
        onClick={onClick}
      />
    );
  }

  // If no image, show Avatar with initials
  return (
    <Avatar
      className={className}
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        bgcolor: "primary.main",
        color: "white",
        fontWeight: 600,
        fontSize: size > 50 ? "1.5rem" : "1rem",
        cursor: onClick ? "pointer" : "default",
        ...sx,
      }}
    >
      {initials}
    </Avatar>
  );
};

export default UserAvatar;
