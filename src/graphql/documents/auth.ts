import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginUserInput!) {
    login(loginInput: $loginInput) {
      user {
        id
        role
        firstName
      }
      access_token
      refresh_token
    }
  }
`;

export const SEND_OTP_MUTATION = gql`
  mutation SendOtp($sendOtpDto: SendOtpDto!) {
    sendOtp(sendOtpDto: $sendOtpDto) {
      code
      status
      description
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($verfiyOtpDto: VerfiyOtpDto!) {
    verifyOtp(verfiyOtpDto: $verfiyOtpDto) {
      access_token
      user {
        id
        role
        firstName
      }
    }
  }
`;
