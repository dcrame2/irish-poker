import React, { useState } from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { variables } from "@/styles/Variables";
import { pXSmall, pBase, buttonType } from "@/styles/Type";
import { MediaQueries } from "@/styles/Utilities";
import axios from "axios";

const ContactForm = styled.form`
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
  border: 1px solid ${variables.white};
  width: 100%;
  ${pXSmall}
  &::placeholder {
    color: ${variables.white};
    opacity: 0.7;
  }

  &::-ms-input-placeholder {
    color: ${variables.white};
  }
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
  ${buttonType}
  width: 100%;
  &:hover {
    background-color: ${variables.color2};
  }
`;

const FormSubmissionContainer = styled.div`
  border: 2px solid ${variables.color1};
  padding: 24px;
  width: 50%;
  margin-top: 8px;
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
  };

  return (
    <>
      <ContactForm onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Email Address*"
          {...register("email", {
            required: true,
            pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/,
          })}
        />
        {errors.email && <span>An email address is required</span>}
        <TextArea
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
          }}
        >
          Submit
        </SubmitButton>
      </ContactForm>
      {formSubmitStatus && (
        <FormSubmissionContainer>
          <FormSubmissionMessage>
            {formSubmitStatus === 200
              ? "Thank you for your feedback it is much appreciated!"
              : "An error has occured during the form submission, please try again."}
          </FormSubmissionMessage>
        </FormSubmissionContainer>
      )}
    </>
  );
}

export default Form;
