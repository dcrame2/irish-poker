import React, { useState } from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { variables } from "@/styles/Variables";
import { pXSmall, pBase } from "@/styles/Type";
import { MediaQueries } from "@/styles/Utilities";
import axios from "axios";

const ContactForm = styled.form`
  /* width: 50%; */
  position: relative;
  flex-direction: column;
  display: flex;
  justify-content: center;
  gap: 12px;
  @media ${MediaQueries.tablet} {
    width: 100%;
  }
`;

const InputStyles = css`
  padding: 15px;
  background-color: unset;

  border: 3px solid ${variables.color1};
  width: 100%;
  ${pXSmall}
`;

const Input = styled(motion.input)`
  ${InputStyles}
`;

const TextArea = styled(motion.textarea)`
  ${InputStyles}
  resize: none;
  min-height: 180px;

  @media ${MediaQueries.mobile} {
    min-height: 140px;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 10px 20px;
  border: unset;
  background-color: ${variables.color1};
  cursor: pointer;
  transition: all ease-out 0.3s;
  margin-top: 8px;
  ${pXSmall}
  &:hover {
    background-color: ${variables.color2};
  }
`;

const FormSubmissionContainer = styled.div`
  border: 2px solid ${variables.color1};
  padding: 24px;
  width: 50%;
  @media ${MediaQueries.mobile} {
    width: 100%;
  }
`;

const FormSubmissionMessage = styled.p`
  text-align: center;
  ${pBase};
`;

function Form() {
  const [formSubmitStatus, setFormSubmitStatus] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    axios
      .post("/api/form-submit", data)
      .then((response: any) => setFormSubmitStatus(response.status));
    console.log(data);
  };

  return (
    <>
      {formSubmitStatus ? (
        <FormSubmissionContainer>
          <FormSubmissionMessage>
            {formSubmitStatus === 200
              ? "Thank you! I have received your contact form submission and will respond as soon as I can."
              : "An error has occured during the form submission, please try again."}
          </FormSubmissionMessage>
        </FormSubmissionContainer>
      ) : (
        <ContactForm onSubmit={handleSubmit(onSubmit)}>
          <Input
            //   initial={{ opacity: 0, y: 100 }}
            //   whileInView={{ opacity: 1, y: 0 }}
            //   viewport={{ once: true, amount: 0.85 }}
            //   transition={{
            //     duration: 0.8,
            //     type: "spring",
            //     stiffness: 50,
            //   }}
            placeholder="Name*"
            {...register("name", { required: true })}
          />
          {errors.email && <span>A name is required</span>}
          <Input
            //   initial={{ opacity: 0, y: 100 }}
            //   whileInView={{ opacity: 1, y: 0 }}
            //   viewport={{ once: true, amount: 0.85 }}
            //   transition={{
            //     duration: 1,
            //     type: "spring",
            //     stiffness: 50,
            //   }}
            placeholder="Email Address*"
            {...register("email", {
              required: true,
              pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/,
            })}
          />
          {errors.email && <span>An email address is required</span>}
          <TextArea
            //   initial={{ opacity: 0, y: 100 }}
            //   whileInView={{ opacity: 1, y: 0 }}
            //   viewport={{ once: true, amount: 0.85 }}
            //   transition={{
            //     duration: 1.2,
            //     type: "spring",
            //     stiffness: 50,
            //   }}
            placeholder="Message*"
            {...register("message", {
              required: true,
            })}
          ></TextArea>
          {errors.message && <span>A message is required</span>}
          <SubmitButton
            disabled={false}
            type="submit"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{
              duration: 1.4,
              type: "spring",
              stiffness: 50,
              //   Feed,
            }}
          >
            Submit
          </SubmitButton>
        </ContactForm>
      )}
    </>
  );
}

export default Form;
