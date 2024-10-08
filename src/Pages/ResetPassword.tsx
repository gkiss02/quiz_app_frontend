import { useContext, useState } from 'react';
import Input from '../Components/Input/Input';
import FormContainer from '../UI/FromContainer';
import styles from './ResetPassword.module.css';
import BlueButton from '../UI/BlueButton';
import { BackendError } from '../Types/BackendError';
import { useNavigate } from 'react-router-dom';
import { ErrorCTX, SuccessCTX } from '../Context/Context';
import SuccessToasterState from '../Context/SuccessToasterState';

function ResetPassword() {
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [passwordError, setPasswordError] = useState<BackendError[]>();
    const navigate = useNavigate();
    const errorToasterState = useContext(ErrorCTX);
    const SuccessToasterState = useContext(SuccessCTX);

    async function resetPassword() {
        try {
        const token = window.location.search.split('=')[1];

        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                confirmPassword
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        if (response.status === 400) {
            let arr: BackendError[] = [];
            data.errors.forEach((error: BackendError) => {
                arr.push(error);
            })
            setPasswordError(arr);
        }

        SuccessToasterState.setSuccess(true);
        SuccessToasterState.setMessage('Password reset successfully');
        navigate('/')
        } catch (error) {
            errorToasterState.setError(true);
        }
    }

    return (
        <FormContainer>
            <div className={styles['text-container']}>
                <h1>Reset Password</h1>
                <p>Type your new password below</p>
            </div>
            <div className={styles['input-container']}>
                <Input
                    type='password'
                    placeholder='New Password'
                    setValue={setPassword}
                    isValid={passwordError !== undefined}
                />
                <Input
                    type='password'
                    placeholder='Confirm Password'
                    setValue={setConfirmPassword}
                    isValid={passwordError !== undefined}
                    errorMessage={passwordError !== undefined ? passwordError[0]?.msg : ''}
                />
            </div>
            <BlueButton onClick={resetPassword} isBig={true}>Reset Password</BlueButton>
        </FormContainer>
    );
}

export default ResetPassword;