import { useState } from "react";
import { Typography, Button, Box } from "@mui/material";

interface AboutSectionProps {
  text: string;
}

const AboutSection = ({ text }: AboutSectionProps) => {
  const [showFull, setShowFull] = useState(false);
  const shortTextLength = 150;

  const displayText =
    showFull || text.length <= shortTextLength
      ? text
      : `${text.slice(0, shortTextLength)}...`;

  return (
    <Box className="space-y-3 pt-4">
      <Typography variant="h6" className="!font-semibold !text-secondary-500">
        About me
      </Typography>
      <Typography
        variant="body1"
        className="!text-neutral-700 !leading-relaxed !text-justify"
      >
        {displayText}
      </Typography>
      {text.length > shortTextLength && (
        <Button
          variant="text"
          onClick={() => setShowFull(!showFull)}
          className="!text-primary-500 !font-semibold !p-0 !min-w-0"
        >
          {showFull ? "Show less" : "Read more"}
        </Button>
      )}
    </Box>
  );
};

export default AboutSection;
