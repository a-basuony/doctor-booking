import { Container, Typography, Box, Divider } from "@mui/material";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <Container maxWidth="md">
        <Box className="space-y-8">
          <Box className="text-center space-y-4 mb-12">
            <Typography
              variant="h3"
              component="h1"
              className="!text-[36px] !font-bold !text-[#05162c] !tracking-tight"
            >
              Privacy Policy
            </Typography>
            <Typography variant="body1" className="!text-neutral-600">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>

          <Divider />

          <Box className="space-y-6">
            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                1. Information We Collect
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed"
              >
                We collect information that you provide directly to us,
                including your name, email address, phone number, and any other
                information you choose to provide when using our doctor booking
                services. We also collect information about your appointments,
                medical preferences, and communication history with healthcare
                providers.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                2. How We Use Your Information
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed !mb-3"
              >
                We use the information we collect to:
              </Typography>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                <li>Process and manage your appointment bookings</li>
                <li>
                  Communicate with you about your appointments and services
                </li>
                <li>Send you important updates and notifications</li>
                <li>Improve our services and user experience</li>
                <li>Ensure the security and integrity of our platform</li>
                <li>Comply with legal obligations and requirements</li>
              </ul>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                3. Information Sharing and Disclosure
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed"
              >
                We do not sell your personal information. We may share your
                information with healthcare providers to facilitate your
                appointments, with service providers who assist us in operating
                our platform, and when required by law or to protect our rights
                and safety.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                4. Data Security
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed"
              >
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the internet is 100%
                secure, and we cannot guarantee absolute security.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                5. Your Rights and Choices
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed !mb-3"
              >
                You have the right to:
              </Typography>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                <li>Access and receive a copy of your personal information</li>
                <li>
                  Request correction of inaccurate or incomplete information
                </li>
                <li>Request deletion of your personal information</li>
                <li>
                  Object to or restrict certain processing of your information
                </li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                6. Cookies and Tracking Technologies
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed"
              >
                We use cookies and similar tracking technologies to collect
                information about your browsing activities and improve your
                experience on our platform. You can control cookies through your
                browser settings, but disabling cookies may affect the
                functionality of our services.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                7. Children's Privacy
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed"
              >
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If you are a parent or guardian and believe
                your child has provided us with personal information, please
                contact us.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                8. Changes to This Privacy Policy
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed"
              >
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. Your continued
                use of our services after such changes constitutes your
                acceptance of the updated Privacy Policy.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="!text-[24px] !font-semibold !text-[#05162c] !mb-3"
              >
                9. Contact Us
              </Typography>
              <Typography
                variant="body1"
                className="!text-neutral-700 !leading-relaxed !mb-3"
              >
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us:
              </Typography>
              <Box className="bg-neutral-50 p-6 rounded-lg space-y-2">
                <Typography variant="body1" className="!text-neutral-700">
                  <strong>Email:</strong> demo@example.com
                </Typography>
                <Typography variant="body1" className="!text-neutral-700">
                  <strong>Phone:</strong> 080 707 555-321
                </Typography>
                <Typography variant="body1" className="!text-neutral-700">
                  <strong>Address:</strong> 526 Melrose Street, Water Mill,
                  11976, New York
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default PrivacyPolicyPage;
