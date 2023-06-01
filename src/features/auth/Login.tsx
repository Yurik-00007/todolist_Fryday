import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {loginTC} from "features/auth/auth.reducer";
import {useAppSelector} from "app/store";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {LoginDataType} from "features/auth/auth.api";
import {useAppDispatch} from "common/hooks";


type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

const validate=(values:LoginDataType) => {
    const errors: FormikErrorType = {}
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (!values.password) {
        errors.password = 'Required'
    } else if (values.password.length<=3) {
        errors.password = 'Invalid password address'
    }
    return errors
}

export const Login = () => {
    const dispatch=useAppDispatch()
    const isLoggedIn=useAppSelector(selectIsLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate,
        onSubmit: values => {
            //alert(JSON.stringify(values, null, 2));
            dispatch(loginTC(values))
            formik.resetForm();
        },
    });

    if(isLoggedIn){
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   //name="email"
                                   // onChange={formik.handleChange}
                                   // value={formik.values.email}
                                   // onBlur={formik.handleBlur}
                                   {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ? <div style={{color:'red'}}>{formik.errors.email}</div> : null}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   // name="password"
                                   // onChange={formik.handleChange}
                                   // value={formik.values.password}
                                   // onBlur={formik.handleBlur}
                                   {...formik.getFieldProps('password')}


                        />
                        {formik.touched.email && formik.errors.password ? <div style={{color:'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox name="rememberMe"
                                                             onChange={formik.handleChange}
                                                             value={formik.values.rememberMe}
                                          />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}