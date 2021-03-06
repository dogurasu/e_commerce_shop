import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id;

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ message, setMessage ] = useState('');

    const dispatch = useDispatch();

    // get our userRegister state
    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;

    // we need to get the userUpdate state bc we need to know if it's successful or not
    const userUpdate = useSelector(state => state.userUpdate);
    const { loading: loadingUpdate , error: errorUpdate, success: successUpdate } = userUpdate;

    // redirect if already logged in
    useEffect(() => {
        // check for success update - if success update, we want to reset the user state or the update state and redirect to user list
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET }); // reset
            history.push('/admin/userlist'); // redirect
        } else { // else, successUpdate is not true
            // userId comes from url
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId));
            } else { // user is already here
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }
    }, [dispatch, userId, user, successUpdate, history])

    // this is where we want to dispatch the register action
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: userId, name, email, isAdmin }))
    }

    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading 
                    ? <Loader /> 
                    : error 
                    ? <Message variant='danger'>{error}</Message> 
                    : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="isadmin">
                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                >
                                </Form.Check>
                            </Form.Group>

                            <Button type="submit" variant="primary">
                                Update
                            </Button>
                        </Form>
                    )
                }
            </FormContainer>
        </>
    )
}

export default UserEditScreen;