import React, {createContext, useReducer, useContext, useEffect} from 'react';
import {jwtDecode} from "jwt-decode";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null,
            };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        user: null,
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
    });


    useEffect(() => {
        if (state.accessToken) {
            const decodedToken = jwtDecode(state.accessToken);
            const user = {
                email: decodedToken.username,
                nickname: decodedToken.nickname,
                role: decodedToken.auth,
            };
            dispatch({ type: 'LOGIN', payload: { user, accessToken: state.accessToken, refreshToken: state.refreshToken } });
        }
    }, [state.accessToken]);

    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
