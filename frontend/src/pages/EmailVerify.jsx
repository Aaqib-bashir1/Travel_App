import Form from "../components/Form";

function EmailVerify() {
    return (
        <Form route="api/users/activate-email/" method="Verify" />
    )
  }
  export default EmailVerify;