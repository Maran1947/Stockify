import React, { useState } from 'react';
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
import Loading from '../../../components/loading/Loading';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signin() {

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUpdate = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSignin = async (e) => {
        e.preventDefault();

        setLoading(true);
        const data = {
            userId: formData.userId,
            password: formData.password
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/signin`, data);
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
    }

    return (
        <Box sx={{ width: '100%', height: "100%", padding: '5rem 2rem' }} >
            <Stack alignItems="center" justifyContent="center" sx={{
                width: '50%',
                margin: '0 auto',
            }} >
                <form
                    method='post'
                    onSubmit={handleSignin}
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
                    }} >Sign in</Typography>
                    <TextField
                        onChange={handleUpdate}
                        sx={{
                            width: '100%',
                            mb: 3
                        }}
                        color="secondary"
                        id="cmUserId"
                        label="User Id"
                        variant="outlined"
                        name="userId"
                        type="text"
                        required />

                    <TextField
                        onChange={handleUpdate}
                        sx={{
                            width: '100%',
                            mb: 3
                        }}
                        color="secondary"
                        id="cmPassword"
                        label="Password"
                        variant="outlined"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
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

                    <Button
                        type="submit"
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
                                "Log in"
                        }
                    </Button>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }} >
                        <Typography sx={{
                            fontSize: '0.9rem',
                            color: 'grey'
                        }} >Don't have an account?</Typography>
                        <Link style={{
                            fontSize: '1rem',
                            color: '#000',
                            textDecoration: 'none',
                        }} to="/signup">Sign up</Link>
                    </Stack>
                </form>
            </Stack>
        </Box>
    )
}

export default Signin