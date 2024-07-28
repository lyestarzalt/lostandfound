<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; 
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="User API",
 *     description="API documentation for user registration and updates"
 * )
 */
class RegisteredUserController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Register a new user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="john@example.com"),
     *             @OA\Property(property="password", type="string", example="verysecurepassword")
     *         )
     *     ),
     *     @OA\Response(response=201, description="User successfully registered"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),  // Encrypt the password
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'User successfully registered.',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/user/update",
     *     summary="Update user information",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="phone_number", type="string", example="1234567890"),
     *             @OA\Property(property="telegram_id", type="string", example="YourTelegramID"),
     *             @OA\Property(property="picture", type="string", format="binary", example="image.jpg")
     *         )
     *     ),
     *     @OA\Response(response=200, description="User updated successfully"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function update(Request $request)
{
    $user = Auth::user();  // Get the authenticated user

    $validator = Validator::make($request->all(), [
        'name' => 'nullable|string|max:255',
        'phone_number' => 'nullable|string',
        'telegram_id' => 'nullable|string',
        'picture' => 'nullable|image|max:1999', 
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    if ($request->has('name')) {
        $user->name = $request->name;
    }
    if ($request->has('phone_number')) {
        $user->phone_number = $request->phone_number;
    }
    if ($request->has('telegram_id')) {
        $user->telegram_id = $request->telegram_id;
    }
    if ($request->hasFile('picture')) {
        $path = $request->file('picture')->store('profile_pictures', 'public');
        $user->picture = $path;
    }

    $user->save();

    return response()->json([
        'message' => 'User updated successfully.',
        'user' => $user
    ]);
}

}
