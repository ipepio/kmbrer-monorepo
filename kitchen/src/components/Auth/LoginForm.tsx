import React, { useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { Button, Divider, Box, FormControl, InputAdornment, IconButton, InputLabel, OutlinedInput } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export interface ILoginFormValues {
    email: string;
    password: string;
    remember: boolean;
}
interface ILoginFormValuesWithErrors extends ILoginFormValues {
    general?: string;
}

interface ILoginFormProps {
    initialValues: ILoginFormValues;
    onSubmit: (
        values: ILoginFormValues,
        actions: FormikHelpers<ILoginFormValuesWithErrors>
    ) => Promise<void>;
}

export const LoginForm: React.FC<ILoginFormProps> = ({ initialValues, onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);

    const validate = ({ email, password }: ILoginFormValues) => {
        const errors: Partial<ILoginFormValues> = {};

        if (!email) {
            errors.email = 'email-required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'email-invalid';
        }

        if (!password) {
            errors.password = 'password-required';
        }

        return errors;
    };

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Formik<ILoginFormValuesWithErrors>
            initialValues={initialValues}
            validate={validate}
            onSubmit={onSubmit}
        >
            {({ errors, values, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            name="email"
                            startAdornment={
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            }
                            label="Email"
                            error={Boolean(errors.email)}
                        />
                        {errors.email && (
                            <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                                {errors.email}
                            </Box>
                        )}
                    </FormControl>

                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange}
                            name="password"
                            startAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="start"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            error={Boolean(errors.password)}
                        />
                        {errors.password && (
                            <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                                {errors.password}
                            </Box>
                        )}
                    </FormControl>
                    <Divider sx={{ my: 2 }} />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ marginBottom: 2 }}
                    >
                        Iniciar sesión
                    </Button>
                    {errors.general && (
                        <Box
                            sx={{
                                mt: 2,
                                color: 'error.main',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                            }}
                        >
                            {errors.general}
                        </Box>
                    )}
                </form>
            )}
        </Formik>
    );
};
