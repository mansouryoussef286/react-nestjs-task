import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserServiceContext } from "../providers/userService.provider";
import type { SignupResModel } from "../models/user.model";
import { ApiContext } from "../providers/api.provider";

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
	const api = useContext(ApiContext)!
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
		<div style={{ maxWidth: 400, margin: "50px auto" }}>
			<h2>Signup</h2>

			<form onSubmit={handleSubmit(onSubmit)}>
				<input {...register("name")} placeholder="name" />
				<p style={{ color: "red" }}>{errors.name?.message}</p>

				<input {...register("email")} placeholder="email" />
				<p style={{ color: "red" }}>{errors.email?.message}</p>

				<input type="password" {...register("password")} placeholder="password" />
				<p style={{ color: "red" }}>{errors.password?.message}</p>

				{serverError && (
					<p
						style={{
							color: "red",
							fontWeight: "bold",
							marginTop: "10px",
							marginBottom: "10px",
						}}
					>
						{serverError}
					</p>
				)}
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Loading..." : "Signup"}
				</button>
			</form>

			<br />
			<button onClick={() => navigate("/signin")}>Already have an account?</button>
		</div>
	);
}
