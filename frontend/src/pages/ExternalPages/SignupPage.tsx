import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserServiceContext } from "../../context/userService.provider";
import type { SignupResModel } from "../../models/user.model";
import "./signin.scss";
const schema = z.object({
	name: z.string().min(3, "name must be at least 3 chars."),
	email: z.email("Invalid email."),
	password: z
		.string()
		.min(8, "Min 8 characters")
		.regex(/(?=.*[A-Za-z])/, "Must contain letters")
		.regex(/(?=.*\d)/, "Must contain numbers")
		.regex(/(?=.*[!@#$%^&*])/, "Must contain special characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
	const navigate = useNavigate();
	const { onSignup } = useContext(UserServiceContext)!;
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
			setServerError(null); // reset old errors

			const res: SignupResModel | null = await api.Post("/account/signup", data);
			if (!res) throw new Error("No response from server");
			onSignup(res);

			navigate("/home");
		} catch (err: any) {
			setServerError(err.response?.data?.message || "signup failed");
		}
	};

	return (
		<div className="wrap">
			<h2>Signup</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="login-form">
				<input {...register("name")} placeholder="name" />
				<p className="input-error">{errors.name?.message}</p>

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
					{isSubmitting ? "Loading..." : "Signup"}
				</button>
			</form>

			<br />
			<Link to="/signin" className="hint">Already have an account?</Link>
		</div>
	);
}
