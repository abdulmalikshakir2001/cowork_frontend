import React,{useState} from 'react';
import "./Login.css";
import logo from "../../Assets/Images/logo/logo.png"
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { loginAdmin } from '../../api/admin';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { authenticate, getAuthenticUser, setAuthenticUser } from '../../api/auth';
import {  useAppDispatch } from '../../lib/hooks'
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../../lib/features/authUser/authUserSlice';



const Login = () => {
    const navigate = useNavigate();
    const [togglePassword, setTogglePassword] = useState(false);
    const [toggleType, setToggleType] = useState("password");
    

    const dispatch =  useAppDispatch();
    



    const {
        register,
        handleSubmit,
        setValue,
    } = useForm();

    const showPass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("password")
    }

    const hidePass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("")
    }

    let onSubmit = (user: any) => {
        const { email, password } = user;
        loginAdmin({email,password}).then((data) => {
            console.log('login',data);
            setAuthenticUser(data.authenticUser)
            dispatch(setAuthUser(getAuthenticUser()))
            
            if(data.statusCode !== 200){
                showNotifications('error','Wrong information');
            }
            else{
                showNotifications('success','Login Successfully');
                authenticate(data, () => {
                    setTimeout(() => {
                        setValue("email", "", { shouldValidate: false });
                        setValue("password", "", { shouldValidate: false });
                        
                        return navigate("/messenger");
                    }, 500)
                })
            }
            
        })
    }
    return (
        <>
        <ToastContainer/>
            <section className="loginSection">
                <div className="loginBox">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="loginForm">
                        <h6>Login</h6>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="loginInput">
                            <label htmlFor="email">Email Address</label>
                            <input type='email' {...register("email", { required: true })} placeholder='Email' className='form-control' />
                        </div>
                        <div className="loginInput">
                            <label htmlFor="password">Password</label>
                            <input type={toggleType} {...register("password", { required: true })} placeholder='Password' />
                            {togglePassword ? <span onClick={() => showPass()}><FontAwesomeIcon icon={faEye} /> </span> : <span onClick={() => hidePass()}><FontAwesomeIcon icon={faEyeSlash} /></span>}
                        </div>
                        <label className="agreement">
                            <label className="tableCheckBox">
                                <div className="contactCheck">
                                    <input type="checkbox" name="agreement" />
                                    <span className="checkmark"></span></div>
                            </label>
                            <span>Remember Me</span>
                        </label>
                        <div className="loginBtn">
                            <button type='submit'>Login</button>
                        </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login