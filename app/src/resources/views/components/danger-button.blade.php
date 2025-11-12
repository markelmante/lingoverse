<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest transition ease-in-out duration-150 hover:bg-red-700']) }} 
    style="background-color: #e53e3e; color: white; margin-top: 10px; padding: 10px 20px;"
>
    {{ $slot }}
</button>