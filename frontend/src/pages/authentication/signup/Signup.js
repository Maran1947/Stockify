import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Stack,
    Button,
    Typography,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../../components/loading/Loading';
import { validateConfirmPassword, validateEmail, validateFullName, validateMobileNumber, validatePassword } from '../../../helpers/FormValidation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signup() {

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };



    const handleUpdate = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        const { fullName, mobile, email, password, confirmPassword } = formData;
        // console.log(formData)
        const formErrors = {
            fullName: validateFullName(fullName),
            mobile: validateMobileNumber(mobile),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(password, confirmPassword),
        };

        if (Object.values(formErrors).every((error) => error === undefined)) {
            setErrors({})
            setLoading(true);
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/user/signup`,
                    {
                        fullName,
                        mobile,
                        email,
                        password,
                    }
                );
                if (response.status === 200) {
                    setLoading(false);
                    localStorage.setItem('cmUser', JSON.stringify(response.data.data));
                    navigate('/dashboard', { replace: true });
                }
            } catch (err) {
                console.log(err);
                alert(err.response.data.message);
                setLoading(false);
            }
        } else {
            // console.log(formErrors);
            setErrors(formErrors);
        }
    };


    useEffect(() => {
        if (localStorage.getItem('cmUser')) {
            navigate('/dashboard', { replace: true });
        }
    }, []);

    return (
        <Box sx={{ width: '100%', height: "100%", padding: '2rem' }} >
            <Stack alignItems="center" justifyContent="center" sx={{
                width: '50%',
                margin: '0 auto',
            }} >
                <form
                    method='post'
                    onSubmit={handleSignup}
                    style={{
                        width: '60%',
                    }}
                >
                    <Typography variant="h4" sx={{
                        width: '100%',
                        mb: 4,
                        color: '#D43725',
                        fontWeight: '500',
                        letterSpacing: 2,
                        pb: 0.5,
                        borderBottom: '1px solid #D43725'
                    }} >Create account</Typography>
                    <Stack sx={{ mb: 3 }} spacing={1}  >
                        <TextField
                            sx={{
                                width: '100%',
                            }}
                            color="secondary"
                            id="cmfullName"
                            label="Full Name"
                            variant="outlined"
                            name="fullName"
                            type="text"
                            onChange={handleUpdate}
                            required />
                        {errors.fullName && <div style={{ color: '#f00' }} >{errors.fullName}</div>}
                    </Stack>
                    <Stack sx={{ mb: 3 }} spacing={1}  >
                        <TextField
                            sx={{
                                width: '100%',
                            }}
                            color="secondary"
                            id="cmEmail"
                            label="Email"
                            variant="outlined"
                            name="email"
                            onChange={handleUpdate}
                            type="email"
                            required />
                        {errors.email && <div style={{ color: '#f00' }} >{errors.email}</div>}
                    </Stack>
                    <Stack sx={{ mb: 3 }} spacing={1}  >
                        <TextField
                            sx={{
                                width: '100%',
                            }}
                            color="secondary"
                            id="cmMobile"
                            label="Mobile Number"
                            variant="outlined"
                            name="mobile"
                            onChange={handleUpdate}
                            type="text"
                            required />
                        {errors.mobile && <div style={{ color: '#f00' }} >{errors.mobile}</div>}
                    </Stack>
                    <Stack sx={{ mb: 3 }} spacing={1}  >
                        <TextField
                            sx={{
                                width: '100%',
                            }}
                            color="secondary"
                            id="cmPassword"
                            label="Password"
                            variant="outlined"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleUpdate}
                            required
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff sx={{
                                            color: '#999999',
                                            fontSize: '1.4rem'
                                        }} /> : <Visibility sx={{
                                            color: '#999999',
                                            fontSize: '1.4rem'
                                        }} />}
                                    </IconButton>
                                </InputAdornment>,
                            }} />
                        {errors.password && <div style={{ color: '#f00' }} >{errors.password}</div>}
                    </Stack>
                    <Stack sx={{ mb: 3 }} spacing={1}  >
                        <TextField
                            sx={{
                                width: '100%',
                            }}
                            color="secondary"
                            id="cmConfirmPassword"
                            label="Confirm Password"
                            variant="outlined"
                            name="confirmPassword"
                            onChange={handleUpdate}
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownConfirmPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff sx={{
                                            color: '#999999',
                                            fontSize: '1.4rem'
                                        }} /> : <Visibility sx={{
                                            color: '#999999',
                                            fontSize: '1.4rem'
                                        }} />}
                                    </IconButton>
                                </InputAdornment>,
                            }} />
                        {errors.confirmPassword && <div style={{ color: '#f00' }} >{errors.confirmPassword}</div>}
                    </Stack>
                    <Button
                        type='submit'
                        sx={{
                            width: '100%',
                            border: '1px solid #D43725',
                            color: '#D43725',
                            '&:hover': {
                                border: '1px solid #000',
                                color: '#000'
                            }
                        }} >
                        {
                            loading ?
                                <Loading /> :
                                "Register"
                        }
                    </Button>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }} >
                        <Typography sx={{
                            fontSize: '0.9rem',
                            color: 'grey'
                        }} >Already have an account?</Typography>
                        <Link style={{
                            fontSize: '1rem',
                            color: '#000',
                            textDecoration: 'none',
                        }} to="/signin">Log in</Link>
                    </Stack>
                </form>
            </Stack>
        </Box>
    )
}

export default Signup