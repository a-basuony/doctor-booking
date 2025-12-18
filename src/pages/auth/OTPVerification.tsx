import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { Box, Button, Typography, TextField, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { ROUTES } from "../../constants/routes";
import { useVerifyOTP, useResendOTP } from "../../hooks/useAuth";
import type { VerifyOTPData } from "../../types/auth";
import { otpSchema } from "../../utils/validation";

type OTPFormData = z.infer<typeof otpSchema>;

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: verifyOTP, isPending: isSending } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP();

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { handleSubmit, setValue } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Set canResend based on countdown
  useEffect(() => {
    setCanResend(countdown === 0);
  }, [countdown]);

  useEffect(() => {
    if (!location.state?.phone) {
      navigate(ROUTES.SIGN_UP);
    }
  }, [location.state?.phone, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    setValue("otp", newOtp.join(""));

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 4) newOtp.push("");
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));

    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data: OTPFormData) => {
    console.log("OTP data:", data);
    //todo: your OTP verification logic
    const formattedData: VerifyOTPData = {
      phone: location.state?.phone,
      otp: data.otp,
    };
    verifyOTP(formattedData);
  };

  const handleResend = () => {
    if (!canResend) return;

    resendOTP(
      { phone: location.state?.phone },
      {
        onSuccess: () => {
          // Reset OTP inputs
          setOtp(["", "", "", ""]);
          setValue("otp", "");
          // Reset countdown
          setCountdown(60);
          setCanResend(false);
          // Focus first input
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  return (
    <AuthLayout noGoogle>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "secondary.main" }}
        >
          Code Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Code has been send to your phone number
        </Typography>
        <Typography variant="body2" color="primary.main" sx={{ mb: 4 }}>
          Check your phone number
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              mb: 4,
            }}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                slotProps={{
                  htmlInput: {
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "24px",
                      fontWeight: "600",
                    },
                  },
                }}
                sx={{
                  width: "50px",
                  "& input": {
                    padding: "8px 8px",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            ))}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            disabled={isSending || otp.join("").length !== 4}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            {isSending ? "Verifying..." : "Verify "}
          </Button>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Didn't receive the code?{" "}
              {canResend ? (
                <Link
                  component="button"
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 600,
                    cursor: isResending ? "not-allowed" : "pointer",
                    opacity: isResending ? 0.6 : 1,
                  }}
                >
                  {isResending ? "Sending..." : "Resend"}
                </Link>
              ) : (
                <Typography
                  component="span"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                  }}
                >
                  Resend in {countdown}s
                </Typography>
              )}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link
              href={ROUTES.SIGN_IN}
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Back to Sign In
            </Link>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default OTPVerification;
