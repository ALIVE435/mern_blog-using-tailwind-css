import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInStart, signInSuccess, signInFailure} from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"
import axios from "axios"



export default function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            //console.log(resultsFromGoogle)
            dispatch(signInStart())
            const res = await axios.post('/api/auth/google', JSON.stringify({
                name:resultsFromGoogle.user.displayName,
                email:resultsFromGoogle.user.email,
                googlePhotoUrl:resultsFromGoogle.user.photoURL,
            }), {
                headers: { 'Content-Type': 'application/json' },
            });
            dispatch(signInSuccess(res.data))
            navigate("/")
        } catch (error) {
            console.log(error)
            dispatch(signInFailure(error.response.data.message))
        }
    }
    return (
        <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </Button>
    )
}