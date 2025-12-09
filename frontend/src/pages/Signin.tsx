import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserServiceContext } from "../providers/userService.provider";
import type { SigninResModel } from "../models/user.model";
import { ApiContext } from "../providers/api.provider";


const schema = z.object({
	email: z.email("Invalid email."),
	password: z.string().min(8, "password too short"),
});

type FormData = z.infer<typeof schema>;

export default function SigninPage() {
	const navigate = useNavigate();
	const { onSignin } = useContext(UserServiceContext)!;
	const api = useContext(ApiContext)!;
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
		<div style={{ maxWidth: 400, margin: "50px auto" }}>
			<h2>Signin</h2>

			<form onSubmit={handleSubmit(onSubmit)}>
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
					{isSubmitting ? "Loading..." : "Signin"}
				</button>
			</form>

			<br />
			<button onClick={() => navigate("/signup")}>Don't have an account?</button>
		</div>
	);
}
