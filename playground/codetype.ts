interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

function handleApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: Date.now()
  };
}


console.log(handleApiResponse({success : true , data : {} , error : "no" , timeStamp : 3334}))