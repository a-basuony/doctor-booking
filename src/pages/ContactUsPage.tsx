import { TextField, Button, Typography, Box } from '@mui/material';
import {
   FaEnvelope,
   FaPhone,
   FaMapMarkerAlt,
} from 'react-icons/fa';

const ContactUsPage = () => {
   return (
      <div className="min-h-screen bg-white flex justify-center items-center py-16">
         <div className="w-full max-w-6xl px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
               <div className="flex flex-col space-y-8">
                  <div className="space-y-4">
                     <Typography variant="h3" component="h1"
                        className="!text-[32px] !font-semibold !text-[#05162c] !tracking-tight">
                        Contact Us
                     </Typography>

                     <Typography variant="body1" className="!text-lg !text-neutral-700 !leading-relaxed">
                        We are committed to processing the information in order to contact you
                        and talk about your questions.
                     </Typography>
                  </div>

                  <div className="space-y-6 pt-4">

                     <Box className="flex items-center space-x-3 rtl:space-x-reverse">
                        <FaPhone className="!text-primary-500 !text-xl" />
                        <Typography variant="body1" className="!text-neutral-700 !text-lg !font-medium">
                           080 707 555-321
                        </Typography>
                     </Box>

                     <Box className="flex items-center space-x-3 rtl:space-x-reverse">
                        <FaEnvelope className="!text-primary-500 !text-xl" />
                        <Typography variant="body1" className="!text-neutral-700 !text-lg !font-medium">
                           demo@example.com
                        </Typography>
                     </Box>

                     <Box className="flex items-start space-x-3 rtl:space-x-reverse">
                        <FaMapMarkerAlt className="!text-primary-500 !text-xl mt-1 flex-shrink-0" />
                        <Typography variant="body1" className="!text-neutral-700 !text-lg !font-medium">
                           526 Melrose Street, Water Mill, 11976
                           <br />
                           New York
                        </Typography>
                     </Box>
                  </div>
               </div>

               <Box component="form" className="space-y-6 w-full">

                  <TextField
                     fullWidth
                     variant="outlined"
                     label="Name"
                     placeholder="Name"
                     name="name"
                     InputLabelProps={{ shrink: true }}
                     className="!rounded-lg"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           borderRadius: '8px',
                           '& fieldset': { borderColor: '#D0D4D8' },
                           '&:hover fieldset': { borderColor: '#A0A0A0' },
                           '&.Mui-focused fieldset': { borderColor: '#145db8' },
                        },
                     }}
                  />

                  <TextField
                     fullWidth
                     variant="outlined"
                     label="Email"
                     placeholder="Email"
                     name="email"
                     InputLabelProps={{ shrink: true }}
                     className="!rounded-lg"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           borderRadius: '8px',
                           '& fieldset': { borderColor: '#D0D4D8' },
                           '&:hover fieldset': { borderColor: '#A0A0A0' },
                           '&.Mui-focused fieldset': { borderColor: '#145db8' },
                        },
                     }}
                  />

                  <TextField
                     fullWidth
                     multiline
                     rows={6}
                     variant="outlined"
                     label="Message"
                     placeholder="Message"
                     name="message"
                     InputLabelProps={{ shrink: true }}
                     className="!rounded-lg"
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           borderRadius: '8px',
                           '& fieldset': { borderColor: '#D0D4D8' },
                           '&:hover fieldset': { borderColor: '#A0A0A0' },
                           '&.Mui-focused fieldset': { borderColor: '#145db8' },
                        },
                     }}
                  />

                  <Button
                     variant="contained"
                     color="primary"
                     type="submit"
                     size="large"
                     className="!bg-primary-500 !text-white !font-semibold !py-3 !mt-8 !rounded-lg !shadow-none"
                     fullWidth
                  >
                     Submit
                  </Button>
               </Box>
            </div>
         </div>
      </div>
   );
};

export default ContactUsPage;