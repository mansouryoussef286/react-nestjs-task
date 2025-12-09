import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserServiceContext } from "../../context/userService.provider";
import type { SigninResModel } from "../../models/user.model";
import "./signin.scss";

const schema = z.object({
	email: z.email("Invalid email."),
	password: z.string().min(8, "password too short"),
});

type FormData = z.infer<typeof schema>;

export default function SigninPage() {
	const navigate = useNavigate();
	const { onSignin } = useContext(UserServiceContext)!;
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: FormData) => {
		try {
			setServerError(null);

			const res: SigninResModel | null = await api.Post("/account/signin", data);
			if (!res) throw new Error("No response from server");
			onSignin(res);

			navigate("/home");
		} catch (err: any) {
			setServerError(err.response?.data?.message || "signin failed");
		}
	};

	return (
		<div className="wrap">
			<h2>Signin</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="login-form">
				<input {...register("email")} placeholder="email" />
				<p className="input-error">{errors.email?.message}</p>

				<input type="password" {...register("password")} placeholder="password" />
				<p className="input-error">{errors.password?.message}</p>

				{serverError && (
					<p
						className="server-error"
					>
						{serverError}
					</p>
				)}
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Loading..." : "Signin"}
				</button>
			</form>

			<br />
			<Link to="/signup" className="hint">Don't have an account?</Link>
		</div>
	);
}


