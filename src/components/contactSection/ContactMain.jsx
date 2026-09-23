import React, { useState } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEnvelope, FaCopy, FaCheck } from "react-icons/fa";
import SectionHeading from "../layout/SectionHeading";
import ContactBackgroundScene from "./ContactBackgroundScene";

const ContactMain = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const resetFormData = () => {
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    const messageTemplateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    const responseTemplateParams = {
      from_name: "John Aledare",
      to_name: formData.name,
      from_email: "aledareoluwaseunjohn@gmail.com",
      to_email: formData.email,
      from_site: "https://github.com/Jaykay73", // Placeholder for actual site URL
    };

    // Message to me
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        messageTemplateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setStatus("success");
          toast.success("🚀 Message sent successfully!");

          resetFormData();
        },
        (error) => {
          console.error("FAILED...", error);
          setStatus("error");
          toast.error("❌ Failed to send message. Please try again.");
        }
      );

    // Message to sender
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_RESPONSE_TEMPLATE_ID,
        responseTemplateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setStatus("success");
          resetFormData();
        },
        (error) => {
          console.error("FAILED...", error);
          setStatus("error");
        }
      );
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("aledareoluwaseunjohn@gmail.com");
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden">
      <ContactBackgroundScene />
      <div className="relative z-10 container mx-auto flex flex-col items-center gap-4 py-12 xl:py-24 px-4">
        <div className="w-full xl:mx-[10%] xl:px-[10%]">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <SectionHeading text="contact">
              <span className="text-accent">me</span>
            </SectionHeading>
          </motion.div>
          <motion.div
            className="flex flex-col items-center justify-center mt-6"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="w-full max-w-2xl mt-12 bg-secondary backdrop-blur-lg rounded-3xl border border-primary/10 p-8 flex flex-col items-center gap-6 text-center shadow-[var(--shadow-neon)]">
              <h3 className="text-2xl font-bold text-accent">Get In Touch</h3>
              <p className="text-primary/80 max-w-md">
                I am currently open to new engineering opportunities and collaborations.
                Whether you have a question or want to discuss a project, feel free to reach out directly.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center max-w-lg mt-2">
                <a
                  href="mailto:aledareoluwaseunjohn@gmail.com"
                  className="w-full sm:w-auto px-7 py-3.5 bg-accent text-background font-bold text-sm rounded-full 
                  hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                >
                  <FaEnvelope className="text-sm" />
                  <span>Send Email</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-accent/40 text-accent font-bold text-sm rounded-full 
                  hover:bg-accent/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy className="text-xs" />}
                  <span>{copied ? "Copied to Clipboard!" : "Copy Email Address"}</span>
                </button>
              </div>

              <div className="flex gap-6 mt-4">
                {/* Social links are already in the footer/nav, but adding small ones here looks nice */}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactMain;
