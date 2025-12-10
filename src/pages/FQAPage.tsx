import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

const faqs = [
  {
    question: 'What is this app used for?',
    answer:
      'This app is designed to help users book appointments with doctors quickly and easily.'
  },
  {
    question: 'Is the app free to use?',
    answer: 'Yes, the app is completely free to use for all users.'
  },
  {
    question: 'How can I find a doctor?',
    answer: 'You can search for doctors by specialty, location, or availability through our app.'
  },
  {
    question: 'Can I cancel my appointment?',
    answer: 'Yes, you can cancel your appointment anytime through the app or by contacting support.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We support various payment methods including credit cards, PayPal, and digital wallets.'
  },
  {
    question: 'How do I edit my profile?',
    answer: 'You can edit your profile information in the settings section of the app.'
  }
];

const FQACard: React.FC = () => {
  return (
    <section className="py-5 mt-10 mb-10">
      <div className="max-w-4xl mx-auto text-center px-4">
       <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-10 border-b w-24 mx-auto border-b-black pb-3">FQAS</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Accordion
              key={f.question}
              className="!bg-gray-200 rounded-lg shadow-none"
              disableGutters
            >
              <AccordionSummary
                expandIcon={<AddIcon className="text-slate-700" />}
                aria-controls={`faq-${i}-content`}
                id={`faq-${i}-header`}
                className="px-5 py-4"
              >
                <Typography className="text-slate-900 text-base md:text-lg font-medium text-left w-full">{f.question}</Typography>
              </AccordionSummary>
              <AccordionDetails className="px-5 pb-4 pt-0">
                <Typography className="text-sm text-slate-600 text-left">{f.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FQACard;