<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; 

class RegisteredUserController extends Controller
{
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
    public function update(Request $request)
{
    $user = Auth::user();  // Get the authenticated user

    $validator = Validator::make($request->all(), [
        'phone_number' => 'nullable|string',
        'telegram_id' => 'nullable|string',
        'picture' => 'nullable|image|max:1999',  // Accepts only images less than 2MB
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
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

