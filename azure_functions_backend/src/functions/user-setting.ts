import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import { userSettingService } from '../services/user-setting.service';

// GET /api/user-setting - Get all user settings
export async function userSettingGetAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userSettings = await userSettingService.getAll();

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Get all user settings error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user settings' }
    };
  }
}

// GET /api/user-setting/{userId} - Get user settings by user ID
export async function userSettingGetByUserId(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const userSettings = await userSettingService.getByUserId(userId);

    if (!userSettings) {
      return {
        status: 404,
        jsonBody: { error: 'User settings not found' }
      };
    }

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Get user settings by user ID error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user settings' }
    };
  }
}

// GET /api/user-setting/theme/{theme} - Get user settings by theme
export async function userSettingGetByTheme(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const theme = (context.triggerMetadata?.theme as string) || request.url.split('/').pop() || '';
    const userSettings = await userSettingService.getSettingsByTheme(theme);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Get user settings by theme error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user settings' }
    };
  }
}

// GET /api/user-setting/language/{language} - Get user settings by language
export async function userSettingGetByLanguage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const language = (context.triggerMetadata?.language as string) || request.url.split('/').pop() || '';
    const userSettings = await userSettingService.getSettingsByLanguage(language);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Get user settings by language error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user settings' }
    };
  }
}

// POST /api/user-setting - Create new user settings
export async function userSettingCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const body = await request.json();
    const userSettings = await userSettingService.create(body);

    return {
      status: 201,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Create user settings error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to create user settings' }
    };
  }
}

// PUT /api/user-setting/{userId} - Update user settings
export async function userSettingUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'PUT') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const body = await request.json();
    const userSettings = await userSettingService.update(userId, body);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Update user settings error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update user settings' }
    };
  }
}

// DELETE /api/user-setting/{userId} - Delete user settings
export async function userSettingRemove(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'DELETE') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    await userSettingService.remove(userId);

    return {
      status: 204
    };

  } catch (error: any) {
    context.log('Delete user settings error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to delete user settings' }
    };
  }
}

// POST /api/user-setting/{userId}/theme - Update theme
export async function userSettingUpdateTheme(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const id = (context.triggerMetadata?.id as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const theme = body.theme;
    const userSettings = await userSettingService.updateTheme(userId, theme);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Update theme error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update theme' }
    };
  }
}

// POST /api/user-setting/{userId}/language - Update language
export async function userSettingUpdateLanguage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const language = body.language;
    const userSettings = await userSettingService.updateLanguage(userId, language);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Update language error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update language' }
    };
  }
}

// POST /api/user-setting/{userId}/timezone - Update timezone
export async function userSettingUpdateTimezone(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const timezone = body.timezone;
    const userSettings = await userSettingService.updateTimezone(userId, timezone);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Update timezone error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update timezone' }
    };
  }
}

// POST /api/user-setting/{userId}/notifications - Update notification preferences
export async function userSettingUpdateNotifications(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const preferences = body.preferences;
    const userSettings = await userSettingService.updateNotificationPreferences(userId, preferences);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Update notification preferences error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update notification preferences' }
    };
  }
}

// POST /api/user-setting/{userId}/dashboard - Update dashboard layout
export async function userSettingUpdateDashboard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const body = await request.json() as any;
    const layout = body.layout;
    const userSettings = await userSettingService.updateDashboardLayout(userId, layout);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Update dashboard layout error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to update dashboard layout' }
    };
  }
}

// POST /api/user-setting/{userId}/toggle-email - Toggle email notifications
export async function userSettingToggleEmail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const userSettings = await userSettingService.toggleEmailNotifications(userId);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Toggle email notifications error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to toggle email notifications' }
    };
  }
}

// POST /api/user-setting/{userId}/toggle-push - Toggle push notifications
export async function userSettingTogglePush(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const userSettings = await userSettingService.togglePushNotifications(userId);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Toggle push notifications error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to toggle push notifications' }
    };
  }
}

// POST /api/user-setting/{userId}/reset - Reset to defaults
export async function userSettingReset(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'POST') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const userId = (context.triggerMetadata?.userId as string) || request.url.split('/').pop() || '';
    const userSettings = await userSettingService.resetToDefaults(userId);

    return {
      status: 200,
      jsonBody: userSettings
    };

  } catch (error: any) {
    context.log('Reset user settings error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to reset user settings' }
    };
  }
}

// GET /api/user-setting/stats - Get user settings stats
export async function userSettingGetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');

  try {
    if (request.method !== 'GET') {
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
    }

    const stats = await userSettingService.getSettingsStats();

    return {
      status: 200,
      jsonBody: stats
    };

  } catch (error: any) {
    context.log('Get user settings stats error:', error);
    return {
      status: 500,
      jsonBody: { error: error.message || 'Failed to retrieve user settings stats' }
    };
  }
}

// Configure the routes
app.http('user-setting-get-all', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: userSettingGetAll,
  route: 'user-setting'
});

app.http('user-setting-get-by-user-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: userSettingGetByUserId,
  route: 'user-setting/{userId}'
});

app.http('user-setting-get-by-theme', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: userSettingGetByTheme,
  route: 'user-setting/theme/{theme}'
});

app.http('user-setting-get-by-language', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: userSettingGetByLanguage,
  route: 'user-setting/language/{language}'
});

app.http('user-setting-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingCreate,
  route: 'user-setting'
});

app.http('user-setting-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: userSettingUpdate,
  route: 'user-setting/{userId}'
});

app.http('user-setting-remove', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: userSettingRemove,
  route: 'user-setting/{userId}'
});

app.http('user-setting-update-theme', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingUpdateTheme,
  route: 'user-setting/{userId}/theme'
});

app.http('user-setting-update-language', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingUpdateLanguage,
  route: 'user-setting/{userId}/language'
});

app.http('user-setting-update-timezone', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingUpdateTimezone,
  route: 'user-setting/{userId}/timezone'
});

app.http('user-setting-update-notifications', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingUpdateNotifications,
  route: 'user-setting/{userId}/notifications'
});

app.http('user-setting-update-dashboard', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingUpdateDashboard,
  route: 'user-setting/{userId}/dashboard'
});

app.http('user-setting-toggle-email', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingToggleEmail,
  route: 'user-setting/{userId}/toggle-email'
});

app.http('user-setting-toggle-push', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingTogglePush,
  route: 'user-setting/{userId}/toggle-push'
});

app.http('user-setting-reset', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: userSettingReset,
  route: 'user-setting/{userId}/reset'
});

app.http('user-setting-get-stats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: userSettingGetStats,
  route: 'user-setting/stats'
}); 